import { WorkerCommunicator } from "./communication";
import type { MessageWithType } from "./types";

export class WorkerClient<
  TReq extends MessageWithType,
  TResp extends MessageWithType,
> extends WorkerCommunicator<TReq, TResp> {
  constructor() {
    super(self);
  }
}
