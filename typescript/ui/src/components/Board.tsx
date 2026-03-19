import { useCallback } from "react";
import { DndContext, rectIntersection } from "@dnd-kit/core";
import type {
  DragStartEvent,
  DragEndEvent,
  DragMoveEvent,
} from "@dnd-kit/core";
import { useMagnetDataStore } from "../stores/magnetDataStore";
import { useMagnetPositionStore } from "../stores/magnetPositionStore";
import { useScale } from "../hooks/useScale";
import { useWasm } from "../hooks/useWasm";
import { Magnet } from "./Magnet";

export function Board() {
  const magnets = useMagnetDataStore((s) => s.magnets);
  const positions = useMagnetPositionStore((s) => s.positions);
  const owners = useMagnetPositionStore((s) => s.owners);
  const { ready, clientId, sendDragStart, sendPositionUpdate, sendDragEnd } =
    useWasm();
  const {
    fontSize,
    boardHeight,
    boardWidth,
    cellHeight,
    cellWidth,
    paddingX,
    paddingY,
  } = useScale();

  const getPosition = useCallback(
    (uuid: string) => {
      const stored = positions[uuid];
      if (stored) return stored;
      const magnet = magnets.find((m) => m.uuid === uuid);
      return magnet ? magnet.start_pos : { x: 0, y: 0 };
    },
    [positions, magnets],
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      sendDragStart(event.active.id as string);
    },
    [sendDragStart],
  );

  const handleDragMove = useCallback(
    (event: DragMoveEvent) => {
      const uuid = event.active.id as string;
      const magnet = magnets.find((m) => m.uuid === uuid);
      if (!magnet || !event.delta) return;

      const currentPos = getPosition(uuid);
      const deltaGridX = event.delta.x / cellWidth;
      const deltaGridY = event.delta.y / cellHeight;

      sendPositionUpdate(
        uuid,
        Math.round(currentPos.x + deltaGridX),
        Math.round(currentPos.y + deltaGridY),
        magnet.width,
        magnet.height,
      );
    },
    [magnets, getPosition, cellWidth, cellHeight, sendPositionUpdate],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const uuid = event.active.id as string;
      const magnet = magnets.find((m) => m.uuid === uuid);
      if (!magnet || !event.delta) return;

      const currentPos = getPosition(uuid);
      const deltaGridX = event.delta.x / cellWidth;
      const deltaGridY = event.delta.y / cellHeight;

      sendDragEnd(
        uuid,
        Math.round(currentPos.x + deltaGridX),
        Math.round(currentPos.y + deltaGridY),
        magnet.width,
        magnet.height,
      );
    },
    [magnets, getPosition, cellWidth, cellHeight, sendDragEnd],
  );

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
              position={getPosition(magnet.uuid)}
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
