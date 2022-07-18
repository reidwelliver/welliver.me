import React from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import TileLayout from "./components/TileLayout";
import { TileProvider } from "./hooks/useTiles";
import { WebsocketConnectionProvider } from "./hooks/useWebsocketConnection";

export default function AppRoot() {
  //const rootClasses = `main theme-${Date.now()%3}`
  const rootClasses = `main theme-1`;

  return (
    <ErrorBoundary>
      <WebsocketConnectionProvider>
        <TileProvider>
          <div className={rootClasses}>
            <div className="background" />
            <div className="background-title" />
            <TileLayout />
          </div>
        </TileProvider>
      </WebsocketConnectionProvider>
    </ErrorBoundary>
  );
}
