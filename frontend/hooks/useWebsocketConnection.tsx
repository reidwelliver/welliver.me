import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
} from "react";

import {
  AbstractWebsocketConnectionConstructor,
  AbstractWebsocketConnection,
} from "@welliver.me/frontend/api/AbstractWebsocketConnection";
import SignalrWebsocketConnection from "@welliver.me/frontend/api/SignalrWebsocketConnection";

const WebsocketConnectionContext =
  createContext<AbstractWebsocketConnection | null>(null);

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
  const connectionRef = useRef(new WebsocketProvider());

  useEffect(() => {
    connectionRef.current = new WebsocketProvider();
  }, [connectionRef]);

  return (
    <WebsocketConnectionContext.Provider value={connectionRef.current}>
      {children}
    </WebsocketConnectionContext.Provider>
  );
}
