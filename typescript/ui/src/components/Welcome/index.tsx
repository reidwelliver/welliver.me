import { useCallback, useEffect, useState } from "react";
import "./Welcome.css";

interface WelcomeProps {
  onClose: () => void;
}

const CLOSE_DURATION = 250;

export function Welcome({ onClose }: WelcomeProps) {
  const [closing, setClosing] = useState(false);

  const startClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, CLOSE_DURATION);
  }, [onClose]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") startClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [startClose]);

  return (
    <div className="welcome-backdrop">
      <div className="welcome-dismiss" onClick={startClose} />
      <div
        className={`welcome-panel ${closing ? "welcome-panel--closing" : ""}`}
      >
        <h1 className="welcome-title">welcome</h1>
        <p className="welcome-text">
          This is the personal website of Reid Welliver, a software engineer who
          likes to build things.
        </p>
        <p className="welcome-text">
          Left-click a magnet to open its link. Right-click and drag to move
          magnets around — everyone sees your changes in real time.
        </p>
        <p className="welcome-text">
          You can try it in 2 browser windows if you want :)
        </p>
        <button className="welcome-close" onClick={startClose}>
          got it
        </button>
      </div>
    </div>
  );
}
