import { DndContext, rectIntersection } from "@dnd-kit/core";
import { useMagnetDataStore } from "../stores/magnetDataStore";
import { useMagnetPositionStore } from "../stores/magnetPositionStore";
import { useScale } from "../hooks/useScale";
import { useMagnetDragEvents, getPosition } from "../hooks/useMagnetDragEvents";
import { useMagnetManager } from "../hooks/useMagnetManager";
import { Magnet } from "./Magnet";

export function Board() {
  const magnets = useMagnetDataStore((s) => s.magnets);
  const owners = useMagnetPositionStore((s) => s.owners);
  const positions = useMagnetPositionStore((s) => s.positions);

  const { ready, clientId } = useMagnetManager();
  const {
    fontSize,
    boardHeight,
    boardWidth,
    cellHeight,
    cellWidth,
    paddingX,
    paddingY,
  } = useScale();
  const { handleDragStart, handleDragMove, handleDragEnd } =
    useMagnetDragEvents();

  return (
    <div
      className="board-container"
      style={{
        padding: `${paddingY}px ${paddingX}px`,
      }}
    >
      <div
        className="board"
        style={{
          width: boardWidth,
          height: boardHeight,
          position: "relative",
          fontSize: `${fontSize}px`,
          backgroundSize: `${cellWidth}px ${cellHeight}px`,
          backgroundImage: `
              linear-gradient(to right, grey 1px, transparent 1px),
              linear-gradient(to bottom, grey 1px, transparent 1px)`,
        }}
      >
        {!ready && <div className="board__loading">Loading...</div>}
        <DndContext
          collisionDetection={rectIntersection}
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
              isOwnedByMe={owners[magnet.uuid] === clientId}
              disabled={!ready}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
}
