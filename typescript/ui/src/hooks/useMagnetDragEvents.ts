import { useCallback } from "react";
import type {
  DragStartEvent,
  DragEndEvent,
  DragMoveEvent,
} from "@dnd-kit/core";

import type { MagnetPosition, MagnetPositionMap } from "../types/magnet";
import { useMagnetDataStore } from "../stores/magnetDataStore";
import { useMagnetPositionStore } from "../stores/magnetPositionStore";
import { magnetManagerInstance as manager } from "../hooks/useMagnetManager";
import { useScale } from "../hooks/useScale";

const UNKNOWN_POSITION: MagnetPosition = { x: 0, y: 0 };
export function getPosition(
  positions: MagnetPositionMap,
  uuid: string,
): MagnetPosition {
  return positions[uuid] || UNKNOWN_POSITION;
}

export function useMagnetDragEvents() {
  const magnets = useMagnetDataStore((s) => s.magnets);
  const positions = useMagnetPositionStore((s) => s.positions);
  const { cellHeight, cellWidth } = useScale();

  const handleDragStart = useCallback((event: DragStartEvent) => {
    manager.sendDragStart(event.active.id as string);
  }, []);

  const handleDragMove = useCallback(
    (event: DragMoveEvent) => {
      const uuid = event.active.id as string;
      const magnet = magnets.find((m) => m.uuid === uuid);
      if (!magnet || !event.delta) return;

      const currentPos = getPosition(positions, uuid);
      const deltaGridX = event.delta.x / cellWidth;
      const deltaGridY = event.delta.y / cellHeight;

      manager.sendPositionUpdate(
        uuid,
        Math.round(currentPos.x + deltaGridX),
        Math.round(currentPos.y + deltaGridY),
        magnet.width,
        magnet.height,
      );
    },
    [magnets, positions, cellWidth, cellHeight],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const uuid = event.active.id as string;
      const magnet = magnets.find((m) => m.uuid === uuid);
      if (!magnet || !event.delta) return;

      const currentPos = getPosition(positions, uuid);
      const deltaGridX = event.delta.x / cellWidth;
      const deltaGridY = event.delta.y / cellHeight;

      manager.sendDragEnd(
        uuid,
        Math.round(currentPos.x + deltaGridX),
        Math.round(currentPos.y + deltaGridY),
        magnet.width,
        magnet.height,
      );
    },
    [magnets, positions, cellWidth, cellHeight],
  );

  return {
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  };
}
