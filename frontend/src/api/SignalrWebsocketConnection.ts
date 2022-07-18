import * as signalR from "@microsoft/signalr";
import { AbstractWebsocketConnection } from "./AbstractWebsocketConnection";
import getBaseUrl from "./getBaseURL";

export default class SignalrWebsocketConnection
  implements AbstractWebsocketConnection
{
  _connection: signalR.HubConnection;

  constructor() {
    this._initialize();
    return this;
  }

  _initialize() {
    this._connection = new signalR.HubConnectionBuilder()
      .withUrl(getBaseUrl())
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this._connection.onclose(() => console.log("disconnected"));
    this._connection.start();
  }

  handleMessage(messageType: string, handler: (message: string) => void) {
    this._connection.on(messageType, handler);
  }

  sendMessage(messageType: string, ...messageArgs: string[]) {
    this._connection.invoke(messageType, ...messageArgs);
  }
}
