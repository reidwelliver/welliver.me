export const CLIENT_ID = `magnet-${Math.random().toString(16).slice(2)}`;
export const BROKER_URL =
  import.meta.env.VITE_MQTT_BROKER_URL || "ws://localhost:9001/mqtt";
