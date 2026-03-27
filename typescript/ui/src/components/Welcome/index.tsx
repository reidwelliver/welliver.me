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
        <h1 className="welcome-title">Welcome</h1>
        <p className="welcome-text">
          This is the personal website of Reid Welliver, a leader and innovator
          in software across industry including IoT and supply chain. I love
          tinkering, building things that are easy to work on, and tackling
          interesting challenges with passion.
        </p>
        <p className="welcome-text">
          This site is a real-time syncronized webtoy meant to simulate the
          magnetic poetry-building kits for refrigerators. Left-click a magnet
          to open its link. Right-click and drag to move magnets around —
          everyone sees your changes in real time. You can try it in 2 browser
          windows if you want :)
        </p>
        <p className="welcome-text">More content on my projects to come.</p>
        <button className="welcome-close" onClick={startClose}>
          got it
        </button>
      </div>
    </div>
  );
}
