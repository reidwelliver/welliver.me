import { useCallback } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import "./Magnet.css";
import type { MagnetData } from "@welliver-me/ui/types/magnet";
import { useScale } from "@welliver-me/ui/hooks/useScale";

interface MagnetProps {
  magnet: MagnetData;
  position: { x: number; y: number };
  isOwned: boolean;
  isOwnedByMe: boolean;
  disabled?: boolean;
  onLinkClick: (href: string, title: string) => void;
}

function isLocalHref(href: string): boolean {
  return href.startsWith("/") || href.startsWith("#");
}

export function Magnet({
  magnet,
  position,
  isOwned,
  isOwnedByMe,
  disabled,
  onLinkClick,
}: MagnetProps) {
  const isDisabled = disabled || (isOwned && !isOwnedByMe);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: magnet.uuid,
      disabled: isDisabled,
    });

  const { cellHeight, cellWidth } = useScale();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Only handle left-click
      if (e.button !== 0) return;
      if (!magnet.href || magnet.href === "#") return;

      if (isLocalHref(magnet.href)) {
        e.preventDefault();
        onLinkClick(magnet.href, magnet.title);
      } else {
        window.open(magnet.href, "_blank", "noopener,noreferrer");
      }
    },
    [magnet.href, magnet.title, onLinkClick],
  );

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    // Prevent browser context menu — right-click is for dragging
    e.preventDefault();
  }, []);

  const style: React.CSSProperties = {
    position: "absolute",
    left: position.x * cellWidth,
    top: position.y * cellHeight,
    width: magnet.width * cellWidth,
    height: magnet.height * cellHeight,
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 1000 : 1,
    cursor: isDisabled ? "not-allowed" : "pointer",
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`magnet ${isDragging ? "magnet--dragging" : ""} ${isOwned && !isOwnedByMe ? "magnet--locked" : ""}`}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      {...listeners}
      {...attributes}
    >
      <span className="magnet__text">{magnet.title}</span>
    </div>
  );
}
