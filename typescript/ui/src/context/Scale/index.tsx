import { useState, useEffect, useCallback } from "react";
import {
  MAX_PADDING,
  ASPECT,
  GRID_ROWS,
  GRID_COLS,
  MIN_PADDING,
} from "../../config/grid";

import type { ScaleState } from "../../types/scale";
import { ScaleContext } from "./context";

export function ScaleProvider(props: { children: React.ReactNode }) {
  const [scale, setScale] = useState<ScaleState>(calculateScale());

  const updateScale = useCallback(() => {
    const scale = calculateScale();
    setScale(scale);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  return (
    <ScaleContext.Provider value={scale}>
      {props.children}
    </ScaleContext.Provider>
  );
}

// optional vw and vh args in case we eventually want to calculate scale
//  for something other than the current window size (a smaller surface)
function calculateScale(
  vw: number = window.innerWidth,
  vh: number = window.innerHeight,
): ScaleState {
  const viewAspect = vw / vh;

  let paddingX = MIN_PADDING;
  let paddingY = MIN_PADDING;

  if (viewAspect > ASPECT) {
    // Viewport is wider than 16:9 — add horizontal padding to narrow it
    const idealWidth = vh * ASPECT;
    const excess = vw - idealWidth;
    paddingX = Math.min(excess / 2, MAX_PADDING);
  } else if (viewAspect < ASPECT) {
    // Viewport is taller than 16:9 — add vertical padding
    const idealHeight = vw / ASPECT;
    const excess = vh - idealHeight;
    paddingY = Math.min(excess / 2, MAX_PADDING);
  }

  const boardHeight = vh - paddingY * 2;
  const boardWidth = vw - paddingX * 2;

  const cellHeight = boardHeight / GRID_ROWS;
  const cellWidth = boardWidth / GRID_COLS;

  const fontSize = Math.max(10, Math.min(18, cellHeight * 1.5));

  return {
    isReasonable: true,
    fontSize,
    boardHeight,
    boardWidth,
    cellHeight,
    cellWidth,
    paddingX,
    paddingY,
  };
}
