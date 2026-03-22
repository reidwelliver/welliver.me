import { useState, useEffect } from "react";
import { MagnetManager } from "../workers/Magnet";

const manager: MagnetManager = new MagnetManager();
export { manager as magnetManagerInstance };

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
  };
}
