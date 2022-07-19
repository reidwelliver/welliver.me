interface AbstractWebsocketConnection {
  handleMessage: (
    messageType: string,
    handler: (message: string) => void
  ) => void;
  sendMessage: (messageType: string, ...messageArgs: string[]) => void;
}

type AbstractWebsocketConnectionConstructor = {
  new (): AbstractWebsocketConnection;
};

export { AbstractWebsocketConnection, AbstractWebsocketConnectionConstructor };
