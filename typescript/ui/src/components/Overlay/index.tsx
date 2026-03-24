import { useCallback, useEffect, useRef, useState } from "react";
import "./Overlay.css";
import { Content } from "@welliver-me/ui/components/Content";

interface OverlayProps {
  href: string;
  title: string;
  onClose: () => void;
}

const INITIAL_HEIGHT = 60; // vh
const MAX_HEIGHT = 95; // vh
const MIN_HEIGHT = 55; // vh - below this, dismiss
const CLOSE_DURATION = 500;
const SCROLL_SENSITIVITY = 0.01; // how much scroll expands/contracts the sheet

export function Overlay({ href, title, onClose }: OverlayProps) {
  const [closing, setClosing] = useState(false);
  const [heightVh, setHeightVh] = useState(INITIAL_HEIGHT);
  const contentRef = useRef<HTMLDivElement>(null);
  const atTopRef = useRef(true);

  const startClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    setTimeout(onClose, CLOSE_DURATION);
  }, [onClose, closing]);

  // Track whether content is scrolled to top
  const handleScroll = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    atTopRef.current = el.scrollTop <= 0;
  }, []);

  // Wheel controls sheet height when content is at top (scrolling up)
  // or when sheet isn't at max height (scrolling down)
  useEffect(() => {
    const el = contentRef.current;
    if (!el || closing) return;

    const handleWheel = (e: WheelEvent) => {
      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      // Scrolling down: expand sheet if not at max, otherwise let content scroll
      if (scrollingDown && heightVh < MAX_HEIGHT) {
        e.preventDefault();
        setHeightVh((h) =>
          Math.min(MAX_HEIGHT, h + e.deltaY * SCROLL_SENSITIVITY),
        );
        return;
      }

      // Scrolling up: if content is at top, shrink the sheet
      if (scrollingUp && atTopRef.current) {
        e.preventDefault();
        const newHeight = heightVh + e.deltaY * SCROLL_SENSITIVITY;
        if (newHeight < MIN_HEIGHT) {
          startClose();
        } else {
          setHeightVh(newHeight);
        }
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [heightVh, closing, startClose]);

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
        style={{ height: `${heightVh}vh` }}
      >
        <div className="overlay-header">
          <span className="overlay-header__title">{title}</span>
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
        <div
          className="overlay-content"
          ref={contentRef}
          onScroll={handleScroll}
        >
          <Content href={href} />
        </div>
      </div>
    </div>
  );
}
