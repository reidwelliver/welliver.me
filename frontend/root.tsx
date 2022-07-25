import React from "react";
// import Overlay from "@welliver.me/frontend/components/Overlay";
import ErrorBoundary from "@welliver.me/frontend/components/ErrorBoundary";
import TileLayout from "@welliver.me/frontend/components/TileLayout";
import { TileProvider } from "@welliver.me/frontend/hooks/useTiles";
import { WebsocketConnectionProvider } from "@welliver.me/frontend/hooks/useWebsocketConnection";

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
            {/* TODO: enable overlay */}
            {/* <Overlay /> */}
          </div>
        </TileProvider>
      </WebsocketConnectionProvider>
    </ErrorBoundary>
  );
}
