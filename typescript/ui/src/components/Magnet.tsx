import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { MagnetData } from '../types/magnet';
import { CELL_SIZE } from '../config/grid';

interface MagnetProps {
  magnet: MagnetData;
  position: { x: number; y: number };
  isOwned: boolean;
  isOwnedByMe: boolean;
  disabled?: boolean;
}

export function Magnet({ magnet, position, isOwned, isOwnedByMe, disabled }: MagnetProps) {
  const isDisabled = disabled || (isOwned && !isOwnedByMe);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: magnet.uuid,
    disabled: isDisabled,
  });

  const style: React.CSSProperties = {
    position: 'absolute',
    left: position.x * CELL_SIZE,
    top: position.y * CELL_SIZE,
    width: magnet.width * CELL_SIZE,
    height: magnet.height * CELL_SIZE,
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 1000 : 1,
    cursor: isDisabled ? 'not-allowed' : 'grab',
    touchAction: 'none',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`magnet ${isDragging ? 'magnet--dragging' : ''} ${isOwned && !isOwnedByMe ? 'magnet--locked' : ''}`}
      {...listeners}
      {...attributes}
    >
      <span className="magnet__text">{magnet.title}</span>
    </div>
  );
}
