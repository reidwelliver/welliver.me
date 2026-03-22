import { useMemo } from "react";
import { DndContext } from "@dnd-kit/core";

import { useMagnetDataStore } from "@welliver-me/ui/stores/magnetDataStore";
import { useMagnetPositionStore } from "@welliver-me/ui/stores/magnetPositionStore";
import { useScale } from "@welliver-me/ui/hooks/useScale";
import {
  useMagnetDragEvents,
  getPosition,
} from "@welliver-me/ui/hooks/useMagnetDragEvents";
import { Magnet } from "@welliver-me/ui/components/Magnet";
import { DEBUG } from "@welliver-me/ui/config";
import { CLIENT_ID } from "@welliver-me/ui/config/network";

export function Board() {
  const magnets = useMagnetDataStore((s) => s.magnets);
  const owners = useMagnetPositionStore((s) => s.owners);
  const positions = useMagnetPositionStore((s) => s.positions);
  const boardStyle = useBoardStyle();
  const boardContainerStyle = useBoardContainerStyle();
  // const { ready } = useMagnetManager();
  const ready = false;
  const { handleDragStart, handleDragMove, handleDragEnd } =
    useMagnetDragEvents();

  return (
    <div className="board-container" style={boardContainerStyle}>
      <div className="board" style={boardStyle}>
        {!ready && <div className="board__loading">Loading...</div>}
        {ready && (
          <DndContext
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
              />
            ))}
          </DndContext>
        )}
      </div>
    </div>
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
