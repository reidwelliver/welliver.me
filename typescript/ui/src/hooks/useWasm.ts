import { useState, useEffect, useRef } from 'react';
import init, { MagnetStateStore } from '../wasm-pkg/magnet_state';
import { useMagnetDataStore } from '../stores/magnetDataStore';
import { useMagnetPositionStore } from '../stores/magnetPositionStore';
import { GRID_COLS, GRID_ROWS } from '../config/grid';

const BROKER_URL = import.meta.env.VITE_MQTT_BROKER_URL || 'ws://localhost:9001/mqtt';

let wasmStore: MagnetStateStore | null = null;

export function getWasmStore(): MagnetStateStore | null {
  return wasmStore;
}

export function useWasm() {
  const [ready, setReady] = useState(false);
  const initedRef = useRef(false);
  const magnets = useMagnetDataStore((s) => s.magnets);

  useEffect(() => {
    if (initedRef.current) return;
    initedRef.current = true;

    (async () => {
      // 1. Initialize WASM
      await init();
      const store = new MagnetStateStore(GRID_COLS, GRID_ROWS);
      wasmStore = store;

      // 2. Load magnet definitions into WASM
      store.load_magnets(JSON.stringify(magnets));

      // 3. Define callbacks for WASM → React state sync
      const onPositionChange = (uuid: string, x: number, y: number) => {
        useMagnetPositionStore.getState().setPosition(uuid, { x, y });
      };

      const onOwnerChange = (uuid: string, owner: string | null) => {
        useMagnetPositionStore.getState().setOwner(uuid, owner);
      };

      const onReadyChange = (isReady: boolean) => {
        setReady(isReady);
      };

      // 4. Connect to MQTT broker (all MQTT handled in Rust/WASM)
      store.connect(BROKER_URL, onPositionChange, onOwnerChange, onReadyChange);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { ready, store: wasmStore };
}
