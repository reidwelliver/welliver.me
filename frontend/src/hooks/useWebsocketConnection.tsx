import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useRef,
} from "react";
import {
  AbstractWebsocketConnectionConstructor,
  AbstractWebsocketConnection,
} from "../api/AbstractWebsocketConnection";

import SignalrWebsocketConnection from "../api/SignalrWebsocketConnection";

const WebsocketConnectionContext =
  createContext<AbstractWebsocketConnection>(null);

export default function useWebsocketConnection() {
  return useContext(WebsocketConnectionContext);
}

type WebsocketConnectionProviderProps<
  T extends AbstractWebsocketConnectionConstructor
> = PropsWithChildren<{
  WebsocketProvider?: T;
}>;

export function WebsocketConnectionProvider<
  T extends AbstractWebsocketConnectionConstructor
>(props: WebsocketConnectionProviderProps<T>) {
  const { children, WebsocketProvider = SignalrWebsocketConnection } = props;
  const connection = useRef(new WebsocketProvider());

  return (
    <WebsocketConnectionContext.Provider value={connection.current}>
      {children}
    </WebsocketConnectionContext.Provider>
  );
}
