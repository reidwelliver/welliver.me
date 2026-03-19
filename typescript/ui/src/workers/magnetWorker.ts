import init, { MagnetStateStore } from "../wasm-pkg/magnet_state";
import type { WorkerRequest, WorkerResponse } from "./messages";

let store: MagnetStateStore | null = null;

function post(msg: WorkerResponse) {
  self.postMessage(msg);
}

async function handleInit(
  magnetsJson: string,
  brokerUrl: string,
  gridCols: number,
  gridRows: number,
  wasmUrl: string,
) {
  await init(wasmUrl);
  store = new MagnetStateStore(gridCols, gridRows);
  store.load_magnets(magnetsJson);

  const onPosition = (uuid: string, x: number, y: number) => {
    post({ type: "position", uuid, x, y });
  };

  const onOwner = (uuid: string, owner: string | null) => {
    post({ type: "owner", uuid, owner });
  };

  const onReady = (ready: boolean) => {
    post({ type: "ready", ready, clientId: store!.get_client_id() });
  };

  store.connect(brokerUrl, onPosition, onOwner, onReady);
}

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const msg = e.data;

  switch (msg.type) {
    case "init":
      handleInit(msg.magnetsJson, msg.brokerUrl, msg.gridCols, msg.gridRows, msg.wasmUrl);
      break;

    case "dragStart":
      store?.request_drag_start(msg.uuid);
      break;

    case "positionUpdate": {
      const result = store?.request_position_update(
        msg.uuid,
        msg.x,
        msg.y,
        msg.width,
        msg.height,
      );
      if (result) {
        const pos = JSON.parse(result) as { x: number; y: number };
        post({ type: "dragResult", uuid: msg.uuid, x: pos.x, y: pos.y });
      }
      break;
    }

    case "dragEnd": {
      const result = store?.request_drag_end(
        msg.uuid,
        msg.x,
        msg.y,
        msg.width,
        msg.height,
      );
      if (result) {
        const pos = JSON.parse(result) as { x: number; y: number };
        post({ type: "dragResult", uuid: msg.uuid, x: pos.x, y: pos.y });
      }
      break;
    }
  }
};
