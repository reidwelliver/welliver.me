import { useCallback, useRef } from 'react';
import { DndContext } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent, DragMoveEvent } from '@dnd-kit/core';
import { useMagnetDataStore } from '../stores/magnetDataStore';
import { useMagnetPositionStore } from '../stores/magnetPositionStore';
import { useScale } from '../hooks/useScale';
import { useWasm, getWasmStore } from '../hooks/useWasm';
import { Magnet } from './Magnet';
import { CELL_SIZE, BASE_WIDTH, BASE_HEIGHT } from '../config/grid';

export function Board() {
  const magnets = useMagnetDataStore((s) => s.magnets);
  const positions = useMagnetPositionStore((s) => s.positions);
  const owners = useMagnetPositionStore((s) => s.owners);
  const setPosition = useMagnetPositionStore((s) => s.setPosition);
  const { ready } = useWasm();
  const containerRef = useRef<HTMLDivElement>(null);
  const scale = useScale(containerRef);

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
      const store = getWasmStore();
      if (!store) return;
      store.request_drag_start(event.active.id as string);
    },
    [],
  );

  const handleDragMove = useCallback(
    (event: DragMoveEvent) => {
      const store = getWasmStore();
      if (!store) return;

      const uuid = event.active.id as string;
      const magnet = magnets.find((m) => m.uuid === uuid);
      if (!magnet || !event.delta) return;

      const currentPos = getPosition(uuid);
      const deltaGridX = event.delta.x / (CELL_SIZE * scale);
      const deltaGridY = event.delta.y / (CELL_SIZE * scale);

      // WASM handles clamping, overlap detection, rate-limited MQTT publish
      const resultJson = store.request_position_update(
        uuid,
        Math.round(currentPos.x + deltaGridX),
        Math.round(currentPos.y + deltaGridY),
        magnet.width,
        magnet.height,
      );

      const pos = JSON.parse(resultJson) as { x: number; y: number };
      setPosition(uuid, pos);
    },
    [magnets, getPosition, setPosition, scale],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const store = getWasmStore();
      if (!store) return;

      const uuid = event.active.id as string;
      const magnet = magnets.find((m) => m.uuid === uuid);
      if (!magnet || !event.delta) return;

      const currentPos = getPosition(uuid);
      const deltaGridX = event.delta.x / (CELL_SIZE * scale);
      const deltaGridY = event.delta.y / (CELL_SIZE * scale);

      // WASM handles final publish + owner release
      const resultJson = store.request_drag_end(
        uuid,
        Math.round(currentPos.x + deltaGridX),
        Math.round(currentPos.y + deltaGridY),
        magnet.width,
        magnet.height,
      );

      const pos = JSON.parse(resultJson) as { x: number; y: number };
      setPosition(uuid, pos);
    },
    [magnets, getPosition, setPosition, scale],
  );

  const clientId = getWasmStore()?.get_client_id() ?? '';

  return (
    <div className="board-container" ref={containerRef}>
      <div
        className="board"
        style={{
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          position: 'relative',
          transform: `scale(${scale})`,
        }}
      >
        {!ready && <div className="board__loading">Loading...</div>}
        <DndContext
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
