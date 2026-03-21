import { DEBUG } from "../../config";
import type {
  MessageWithType,
  MessageType,
  EventCallback,
  EventListenerMap,
  MessageOfType,
} from "./types";

type OnMessageHandler<M extends MessageWithType> = <T extends MessageType<M>>(
  e: MessageEvent<MessageOfType<M, T>>,
) => void;

interface Communicable<
  TReq extends MessageWithType,
  TResp extends MessageWithType,
> {
  onmessage: OnMessageHandler<TResp> | null;
  postMessage(msg: TReq): void;
}

export class WorkerCommunicator<
  TReq extends MessageWithType,
  TResp extends MessageWithType,
> {
  private comms: Communicable<TReq, TResp>;
  private eventListeners: EventListenerMap<TResp> = {};

  constructor(comms: Communicable<TReq, TResp>) {
    this.comms = comms;
    this.comms.onmessage = this.handleResponse.bind(this);
  }

  public subscribe<T extends MessageType<TResp>>(
    eType: T,
    callback: EventCallback<TResp, T>,
  ) {
    this.eventListeners[eType] = this.eventListeners[eType] || [];
    this.eventListeners[eType].push(callback);
  }

  public unsubscribe<T extends MessageType<TResp>>(
    eType: T,
    callback: EventCallback<TResp, T>,
  ) {
    this.eventListeners[eType] = this.eventListeners[eType]?.filter(
      (cb) => cb !== callback,
    );
  }

  private handleResponse<T extends MessageType<TResp>>(
    e: MessageEvent<MessageOfType<TResp, T>>,
  ) {
    const msg = e.data;
    if (DEBUG) {
      console.log("Received:", msg);
    }

    this.eventListeners[msg.type]?.forEach((cb) => {
      cb(msg);
    });
  }

  public sendRequest<T extends TReq>(req: T) {
    if (DEBUG) {
      console.log("Sending:", req);
    }
    this.comms.postMessage(req);
  }
}
