#![cfg(target_arch = "wasm32")]

use mqtt5_wasm::client::WasmMqttClient;
use mqtt5_wasm::client::RustMessage;
use mqtt5_wasm::config::{WasmConnectOptions, WasmPublishOptions, WasmReconnectOptions};
use mqtt5_protocol::QoS;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::spawn_local;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Position {
    pub x: i32,
    pub y: i32,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct MagnetData {
    pub title: String,
    pub uuid: String,
    pub href: String,
    pub start_pos: Position,
    pub width: i32,
    pub height: i32,
}

/// Shared interior state that both the WASM API and MQTT callbacks can access.
struct StoreInner {
    magnets: Vec<MagnetData>,
    positions: HashMap<String, Position>,
    owners: HashMap<String, Option<String>>,
    grid_cols: i32,
    grid_rows: i32,
    connected: bool,
    client_id: String,
    last_publish_times: HashMap<String, f64>,

    // JS callbacks to notify React of state changes
    cb_on_position: Option<js_sys::Function>,
    cb_on_owner: Option<js_sys::Function>,
    cb_on_ready_change: Option<js_sys::Function>,
}

#[wasm_bindgen]
pub struct MagnetStateStore {
    inner: Rc<RefCell<StoreInner>>,
    mqtt: Rc<WasmMqttClient>,
}

#[wasm_bindgen]
impl MagnetStateStore {
    #[wasm_bindgen(constructor)]
    pub fn new(grid_cols: i32, grid_rows: i32) -> Self {
        let client_id = format!(
            "welliver-{}",
            &js_sys::Math::random().to_string()[2..10]
        );
        let mqtt = Rc::new(WasmMqttClient::new(client_id.clone()));

        Self {
            inner: Rc::new(RefCell::new(StoreInner {
                magnets: Vec::new(),
                positions: HashMap::new(),
                owners: HashMap::new(),
                grid_cols,
                grid_rows,
                connected: false,
                client_id,
                last_publish_times: HashMap::new(),
                cb_on_position: None,
                cb_on_owner: None,
                cb_on_ready_change: None,
            })),
            mqtt,
        }
    }

    /// Load magnet definitions from JSON.
    pub fn load_magnets(&self, magnets_json: &str) {
        match serde_json::from_str::<Vec<MagnetData>>(magnets_json) {
            Ok(magnets) => {
                let mut inner = self.inner.borrow_mut();
                for m in &magnets {
                    if !inner.positions.contains_key(&m.uuid) {
                        inner.positions.insert(m.uuid.clone(), m.start_pos.clone());
                    }
                }
                inner.magnets = magnets;
            }
            Err(e) => {
                web_sys::console::error_1(&format!("Failed to parse magnets: {e}").into());
            }
        }
    }

    /// Connect to MQTT broker and set up subscriptions.
    ///
    /// Arguments:
    /// - broker_url: WebSocket URL (ws:// or wss://)
    /// - cb_on_position: JS function(uuid, x, y) called on remote position changes
    /// - cb_on_owner: JS function(uuid, owner_or_null) called on ownership changes
    /// - cb_on_ready_change: JS function(ready: bool) called when ready state changes
    pub fn connect(
        &self,
        broker_url: &str,
        cb_on_position: js_sys::Function,
        cb_on_owner: js_sys::Function,
        cb_on_ready_change: js_sys::Function,
    ) {
        {
            let mut inner = self.inner.borrow_mut();
            inner.cb_on_position = Some(cb_on_position);
            inner.cb_on_owner = Some(cb_on_owner);
            inner.cb_on_ready_change = Some(cb_on_ready_change);
        }

        let mqtt = Rc::clone(&self.mqtt);
        let inner = Rc::clone(&self.inner);
        let url = broker_url.to_string();

        // Set up lifecycle callbacks
        {
            let inner_connect = Rc::clone(&inner);
            let mqtt_sub = Rc::clone(&mqtt);
            let inner_sub = Rc::clone(&inner);
            mqtt.on_connect(Closure::<dyn Fn(JsValue, JsValue)>::new(move |_reason: JsValue, _session: JsValue| {
                {
                    let mut s = inner_connect.borrow_mut();
                    s.connected = true;
                }
                notify_ready(&inner_connect);

                // Subscribe to magnet topics using internal Rust API
                let inner_pos = Rc::clone(&inner_sub);
                let inner_own = Rc::clone(&inner_sub);
                let mqtt_pos = Rc::clone(&mqtt_sub);
                let mqtt_own = Rc::clone(&mqtt_sub);

                spawn_local(async move {
                    let pos_cb = {
                        let inner = Rc::clone(&inner_pos);
                        Box::new(move |msg: RustMessage| {
                            handle_position_message(&inner, &msg);
                        }) as Box<dyn Fn(RustMessage)>
                    };
                    if let Err(e) = mqtt_pos.subscribe_with_callback_internal(
                        "magnets/+/position", QoS::AtLeastOnce, pos_cb
                    ).await {
                        web_sys::console::error_1(&format!("Subscribe position failed: {e:?}").into());
                    }

                    let own_cb = {
                        let inner = Rc::clone(&inner_own);
                        Box::new(move |msg: RustMessage| {
                            handle_owner_message(&inner, &msg);
                        }) as Box<dyn Fn(RustMessage)>
                    };
                    if let Err(e) = mqtt_own.subscribe_with_callback_internal(
                        "magnets/+/owner", QoS::AtLeastOnce, own_cb
                    ).await {
                        web_sys::console::error_1(&format!("Subscribe owner failed: {e:?}").into());
                    }
                });
            }).into_js_value().unchecked_into());
        }

        {
            let inner_dc = Rc::clone(&inner);
            mqtt.on_disconnect(Closure::<dyn Fn()>::new(move || {
                {
                    inner_dc.borrow_mut().connected = false;
                }
                notify_ready(&inner_dc);
            }).into_js_value().unchecked_into());
        }

        {
            let inner_err = Rc::clone(&inner);
            mqtt.on_error(Closure::<dyn Fn(JsValue)>::new(move |err: JsValue| {
                web_sys::console::error_1(&format!("MQTT error: {err:?}").into());
                {
                    inner_err.borrow_mut().connected = false;
                }
                notify_ready(&inner_err);
            }).into_js_value().unchecked_into());
        }

        // Enable auto-reconnect
        let reconnect_opts = WasmReconnectOptions::new();
        mqtt.set_reconnect_options(&reconnect_opts);
        mqtt.enable_auto_reconnect(true);

        // Connect
        spawn_local(async move {
            let mut config = WasmConnectOptions::new();
            config.set_cleanStart(true);
            config.set_keepAlive(60);

            if let Err(e) = mqtt.connect_with_options(&url, &config).await {
                web_sys::console::error_1(&format!("MQTT connect failed: {e:?}").into());
                inner.borrow_mut().connected = false;
                notify_ready(&inner);
            }
        });
    }

    /// Returns true when magnets are loaded and MQTT is connected.
    pub fn is_ready(&self) -> bool {
        let inner = self.inner.borrow();
        inner.connected && !inner.magnets.is_empty()
    }

    /// Get the client ID.
    pub fn get_client_id(&self) -> String {
        self.inner.borrow().client_id.clone()
    }

    /// Called when user starts dragging a magnet.
    pub fn request_drag_start(&self, uuid: &str) {
        let client_id = self.inner.borrow().client_id.clone();
        {
            let mut inner = self.inner.borrow_mut();
            inner.owners.insert(uuid.to_string(), Some(client_id.clone()));
        }
        notify_owner(&self.inner, uuid, Some(&client_id));
        self.publish_retained(&format!("magnets/{uuid}/owner"), client_id.as_bytes());
    }

    /// Called during drag move. Returns clamped position as JSON.
    pub fn request_position_update(
        &self,
        uuid: &str,
        x: i32,
        y: i32,
        width: i32,
        height: i32,
    ) -> String {
        let clamped = {
            let inner = self.inner.borrow();
            clamp_position(x, y, width, height, inner.grid_cols, inner.grid_rows)
        };

        // Reject move if it would overlap another magnet
        if self.has_overlap(uuid, clamped.x, clamped.y, width, height) {
            let inner = self.inner.borrow();
            return match inner.positions.get(uuid) {
                Some(p) => serde_json::to_string(p).unwrap_or_default(),
                None => serde_json::to_string(&clamped).unwrap_or_default(),
            };
        }

        {
            let mut inner = self.inner.borrow_mut();
            inner.positions.insert(uuid.to_string(), clamped.clone());
        }
        let json = serde_json::to_string(&clamped).unwrap_or_default();

        // Rate limit MQTT publish to 100ms
        let now = js_sys::Date::now();
        let should_publish = {
            let inner = self.inner.borrow();
            let last = inner.last_publish_times.get(uuid).copied().unwrap_or(0.0);
            now - last >= 100.0
        };
        if should_publish {
            self.inner.borrow_mut().last_publish_times.insert(uuid.to_string(), now);
            self.publish_retained(&format!("magnets/{uuid}/position"), json.as_bytes());
        }

        json
    }

    /// Called when user drops a magnet. Returns final position as JSON.
    pub fn request_drag_end(
        &self,
        uuid: &str,
        x: i32,
        y: i32,
        width: i32,
        height: i32,
    ) -> String {
        let clamped = {
            let inner = self.inner.borrow();
            clamp_position(x, y, width, height, inner.grid_cols, inner.grid_rows)
        };

        let final_pos = if self.has_overlap(uuid, clamped.x, clamped.y, width, height) {
            let inner = self.inner.borrow();
            inner.positions.get(uuid).cloned().unwrap_or(clamped)
        } else {
            let mut inner = self.inner.borrow_mut();
            inner.positions.insert(uuid.to_string(), clamped.clone());
            clamped
        };

        let json = serde_json::to_string(&final_pos).unwrap_or_default();

        // Publish final position (bypass rate limit)
        self.publish_retained(&format!("magnets/{uuid}/position"), json.as_bytes());

        // Release ownership
        {
            let mut inner = self.inner.borrow_mut();
            inner.owners.insert(uuid.to_string(), None);
            inner.last_publish_times.remove(uuid);
        }
        notify_owner(&self.inner, uuid, None);
        self.publish_retained(&format!("magnets/{uuid}/owner"), b"");

        json
    }

    /// Get a magnet's current position as JSON.
    pub fn get_position(&self, uuid: &str) -> String {
        let inner = self.inner.borrow();
        match inner.positions.get(uuid) {
            Some(pos) => serde_json::to_string(pos).unwrap_or_default(),
            None => String::new(),
        }
    }
}

// Private methods
impl MagnetStateStore {
    fn has_overlap(&self, uuid: &str, x: i32, y: i32, width: i32, height: i32) -> bool {
        let inner = self.inner.borrow();
        for magnet in &inner.magnets {
            if magnet.uuid == uuid {
                continue;
            }
            let other_pos = inner.positions.get(&magnet.uuid).unwrap_or(&magnet.start_pos);
            if x < other_pos.x + magnet.width
                && x + width > other_pos.x
                && y < other_pos.y + magnet.height
                && y + height > other_pos.y
            {
                return true;
            }
        }
        false
    }

    fn publish_retained(&self, topic: &str, payload: &[u8]) {
        let mqtt = Rc::clone(&self.mqtt);
        let topic = topic.to_string();
        let payload = payload.to_vec();
        spawn_local(async move {
            let mut opts = WasmPublishOptions::new();
            opts.set_qos(1);
            opts.set_retain(true);
            if let Err(e) = mqtt.publish_with_options(&topic, &payload, &opts).await {
                web_sys::console::error_1(&format!("Publish failed: {e:?}").into());
            }
        });
    }
}

// Free functions for MQTT message handling
fn handle_position_message(inner: &Rc<RefCell<StoreInner>>, msg: &RustMessage) {
    let parts: Vec<&str> = msg.topic.split('/').collect();
    if parts.len() != 3 {
        return;
    }
    let uuid = parts[1];

    let payload = String::from_utf8_lossy(&msg.payload);
    if let Ok(pos) = serde_json::from_str::<Position>(&payload) {
        let (grid_cols, grid_rows, width, height) = {
            let s = inner.borrow();
            let (w, h) = s.magnets.iter()
                .find(|m| m.uuid == uuid)
                .map(|m| (m.width, m.height))
                .unwrap_or((1, 1));
            (s.grid_cols, s.grid_rows, w, h)
        };

        let clamped = clamp_position(pos.x, pos.y, width, height, grid_cols, grid_rows);
        {
            let mut s = inner.borrow_mut();
            s.positions.insert(uuid.to_string(), clamped.clone());
        }

        let s = inner.borrow();
        if let Some(ref cb) = s.cb_on_position {
            let _ = cb.call3(
                &JsValue::NULL,
                &JsValue::from_str(uuid),
                &JsValue::from_f64(clamped.x as f64),
                &JsValue::from_f64(clamped.y as f64),
            );
        }
    }
}

fn handle_owner_message(inner: &Rc<RefCell<StoreInner>>, msg: &RustMessage) {
    let parts: Vec<&str> = msg.topic.split('/').collect();
    if parts.len() != 3 {
        return;
    }
    let uuid = parts[1];

    let payload = String::from_utf8_lossy(&msg.payload);
    let owner = if payload.is_empty() || payload.as_ref() == "null" {
        None
    } else {
        Some(payload.to_string())
    };

    {
        let mut s = inner.borrow_mut();
        s.owners.insert(uuid.to_string(), owner.clone());
    }

    notify_owner(inner, uuid, owner.as_deref());
}

fn clamp_position(x: i32, y: i32, width: i32, height: i32, cols: i32, rows: i32) -> Position {
    Position {
        x: x.max(0).min(cols - width),
        y: y.max(0).min(rows - height),
    }
}

fn notify_ready(inner: &Rc<RefCell<StoreInner>>) {
    let s = inner.borrow();
    let ready = s.connected && !s.magnets.is_empty();
    if let Some(ref cb) = s.cb_on_ready_change {
        let _ = cb.call1(&JsValue::NULL, &JsValue::from_bool(ready));
    }
}

fn notify_owner(inner: &Rc<RefCell<StoreInner>>, uuid: &str, owner: Option<&str>) {
    let s = inner.borrow();
    if let Some(ref cb) = s.cb_on_owner {
        let _ = cb.call2(
            &JsValue::NULL,
            &JsValue::from_str(uuid),
            &match owner {
                Some(o) => JsValue::from_str(o),
                None => JsValue::NULL,
            },
        );
    }
}
