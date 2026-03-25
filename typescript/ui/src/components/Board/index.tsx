import { useCallback, useMemo, useState } from "react";
import { DndContext, useSensor, useSensors } from "@dnd-kit/core";

import "./Board.css";
import { useMagnetDataStore } from "@welliver-me/ui/stores/magnetDataStore";
import { useMagnetPositionStore } from "@welliver-me/ui/stores/magnetPositionStore";
import { useScale } from "@welliver-me/ui/hooks/useScale";
import {
  useMagnetDragEvents,
  getPosition,
} from "@welliver-me/ui/hooks/useMagnetDragEvents";
import { Magnet } from "@welliver-me/ui/components/Magnet";
import { Overlay } from "@welliver-me/ui/components/Overlay";
import { Welcome } from "@welliver-me/ui/components/Welcome";
import { DEBUG } from "@welliver-me/ui/config";
import { CLIENT_ID } from "@welliver-me/ui/workers/Magnet/manager";
import { RightClickSensor } from "@welliver-me/ui/sensors/RightClickSensor";
import { Loading } from "./Loading";

interface OverlayState {
  href: string;
  title: string;
}

export function Board() {
  const magnets = useMagnetDataStore((s) => s.magnets);
  const owners = useMagnetPositionStore((s) => s.owners);
  const positions = useMagnetPositionStore((s) => s.positions);
  const boardStyle = useBoardStyle();
  const ready = useMagnetPositionStore((s) => s.ready);
  const boardContainerStyle = useBoardContainerStyle();
  const { handleDragStart, handleDragMove, handleDragEnd } =
    useMagnetDragEvents();

  const sensors = useSensors(useSensor(RightClickSensor));

  const [overlay, setOverlay] = useState<OverlayState | null>(null);
  const [showWelcome, setShowWelcome] = useState(
    () => localStorage.getItem("welliver-welcome-dismissed") !== "true",
  );

  const handleLinkClick = useCallback((href: string, title: string) => {
    switch (href.charAt(0)) {
      case "#":
        setOverlay({ href, title });
        break;
      case "/":
      default:
        window.open(href, "_blank", "noopener,noreferrer");
    }
  }, []);

  const handleOverlayClose = useCallback(() => {
    setOverlay(null);
  }, []);

  const handleWelcomeClose = useCallback(() => {
    setShowWelcome(false);
    localStorage.setItem("welliver-welcome-dismissed", "true");
  }, []);

  const handleWelcomeOpen = useCallback(() => {
    setShowWelcome(true);
  }, []);

  if (!ready) {
    return <Loading />;
  }

  return (
    <>
      <div className="board-container" style={boardContainerStyle}>
        <div
          className={`board ${overlay || showWelcome ? "board--faded" : ""}`}
          style={boardStyle}
        >
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          >
            {magnets.map((magnet) => (
              <Magnet
                key={magnet.uuid}
                magnet={magnet}
                position={getPosition(positions, magnet.uuid)}
                isOwned={owners[magnet.uuid] != null}
                isOwnedByMe={owners[magnet.uuid] === CLIENT_ID}
                disabled={!ready}
                onLinkClick={handleLinkClick}
              />
            ))}
          </DndContext>
        </div>
      </div>
      {showWelcome && <Welcome onClose={handleWelcomeClose} />}
      {!showWelcome && !overlay && (
        <button className="help-fab" onClick={handleWelcomeOpen}>
          ?
        </button>
      )}
      {overlay && (
        <Overlay
          href={overlay.href}
          title={overlay.title}
          onClose={handleOverlayClose}
        />
      )}
    </>
  );
}

function useBoardContainerStyle() {
  const { paddingX, paddingY } = useScale();

  return useMemo(
    () => ({
      padding: `${paddingY}px ${paddingX}px`,
    }),
    [paddingX, paddingY],
  );
}

function useBoardStyle() {
  const { fontSize, boardHeight, boardWidth, cellHeight, cellWidth } =
    useScale();

  return useMemo(() => {
    const backgroundStyle = DEBUG
      ? {
          backgroundSize: `${cellWidth}px ${cellHeight}px`,
          backgroundImage: `
          linear-gradient(to right, grey 1px, transparent 1px),
          linear-gradient(to bottom, grey 1px, transparent 1px)`,
        }
      : {};

    return {
      width: boardWidth,
      height: boardHeight,
      position: "relative" as const,
      fontSize: `${fontSize}px`,
      ...backgroundStyle,
    };
  }, [boardWidth, boardHeight, cellWidth, cellHeight, fontSize]);
}
