import { useState, useEffect, useRef, useCallback } from "react";
import { useMagnetDataStore } from "../stores/magnetDataStore";
import { useMagnetPositionStore } from "../stores/magnetPositionStore";
import { GRID_COLS, GRID_ROWS } from "../config/grid";
import type { WorkerRequest, WorkerResponse } from "../workers/messages";
import wasmUrl from "../wasm-pkg/magnet_state_bg.wasm?url";

const BROKER_URL =
  import.meta.env.VITE_MQTT_BROKER_URL || "ws://localhost:9001/mqtt";

let workerInstance: Worker | null = null;
let clientId = "";

export function useWasm() {
  const [ready, setReady] = useState(false);
  const initedRef = useRef(false);
  const magnets = useMagnetDataStore((s) => s.magnets);

  useEffect(() => {
    if (initedRef.current) return;
    initedRef.current = true;

    const worker = new Worker(
      new URL("../workers/magnetWorker.ts", import.meta.url),
      { type: "module" },
    );
    workerInstance = worker;

    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      const msg = e.data;
      switch (msg.type) {
        case "ready":
          clientId = msg.clientId;
          setReady(msg.ready);
          break;
        case "position":
          useMagnetPositionStore
            .getState()
            .setPosition(msg.uuid, { x: msg.x, y: msg.y });
          break;
        case "owner":
          useMagnetPositionStore.getState().setOwner(msg.uuid, msg.owner);
          break;
        case "dragResult":
          useMagnetPositionStore
            .getState()
            .setPosition(msg.uuid, { x: msg.x, y: msg.y });
          break;
      }
    };

    const initMsg: WorkerRequest = {
      type: "init",
      magnetsJson: JSON.stringify(magnets),
      brokerUrl: BROKER_URL,
      gridCols: GRID_COLS,
      gridRows: GRID_ROWS,
      wasmUrl,
    };
    worker.postMessage(initMsg);

    return () => {
      worker.terminate();
      workerInstance = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sendDragStart = useCallback((uuid: string) => {
    workerInstance?.postMessage({
      type: "dragStart",
      uuid,
    } satisfies WorkerRequest);
  }, []);

  const sendPositionUpdate = useCallback(
    (uuid: string, x: number, y: number, width: number, height: number) => {
      workerInstance?.postMessage({
        type: "positionUpdate",
        uuid,
        x,
        y,
        width,
        height,
      } satisfies WorkerRequest);
    },
    [],
  );

  const sendDragEnd = useCallback(
    (uuid: string, x: number, y: number, width: number, height: number) => {
      workerInstance?.postMessage({
        type: "dragEnd",
        uuid,
        x,
        y,
        width,
        height,
      } satisfies WorkerRequest);
    },
    [],
  );

  return { ready, clientId, sendDragStart, sendPositionUpdate, sendDragEnd };
}
