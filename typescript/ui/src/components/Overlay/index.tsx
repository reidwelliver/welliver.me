import { useCallback, useEffect, useState } from "react";
import "./Overlay.css";
import { Content } from "@welliver-me/ui/components/Content";
import { getContentTitle } from "@welliver-me/ui/components/Content/config";

interface OverlayProps {
  href: string;
  title: string;
  onClose: () => void;
}

const CLOSE_DURATION = 200;

export function Overlay({ href, onClose }: OverlayProps) {
  const [closing, setClosing] = useState(false);

  const startClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    setTimeout(onClose, CLOSE_DURATION);
  }, [onClose, closing]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") startClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [startClose]);

  return (
    <div className="overlay-backdrop">
      <div className="overlay-dismiss" onClick={startClose} />
      <div
        className={`overlay-panel ${closing ? "overlay-panel--closing" : ""}`}
      >
        <div className="overlay-header">
          <span className="overlay-header__title">{getContentTitle(href)}</span>
          <div className="overlay-header__actions">
            <kbd className="overlay-header__esc" onClick={startClose}>
              <svg
                width="18"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <text
                  x="7"
                  y="10.5"
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="Jost, sans-serif"
                  fontWeight="600"
                  fill="currentColor"
                >
                  ESC
                </text>
              </svg>
            </kbd>
            <button className="overlay-header__close" onClick={startClose}>
              &times;
            </button>
          </div>
        </div>
        <div className="overlay-content">
          <Content href={href} />
        </div>
      </div>
    </div>
  );
}
