import { WorkerCommunicator } from "./communication";
import type { MessageWithType } from "./types";

export class WorkerManager<
  TReq extends MessageWithType,
  TResp extends MessageWithType,
> extends WorkerCommunicator<TReq, TResp> {
  private worker: Worker | null = null;

  constructor(workerUrl: URL) {
    const worker = createWorker(workerUrl);
    super(worker);
  }

  public terminate() {
    this.worker?.terminate();
    this.worker = null;
  }
}

function createWorker(workerUrl: URL): Worker {
  return new Worker(workerUrl, {
    type: "module",
  });
}
