import { useState, useEffect } from "react";
import { MagnetManager, CLIENT_ID } from "../workers/Magnet";

const manager: MagnetManager = new MagnetManager();

export function useMagnetManager() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready) {
      const waitForReady = async () => {
        const ready = await manager.ready;
        setReady(ready);
      };
      waitForReady();
      manager.init();
    }
  }, [ready]);

  return {
    ready,
    clientId: CLIENT_ID,
    sendDragStart: manager.sendDragStart.bind(manager),
    sendPositionUpdate: manager.sendPositionUpdate.bind(manager),
    sendDragEnd: manager.sendDragEnd.bind(manager),
  };
}
