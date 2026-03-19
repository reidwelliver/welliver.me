import { useContext } from "react";
import type { ScaleState } from "../types/scale";
import { ScaleContext } from "../context/Scale/context";

export function useScale(): ScaleState {
  const scale = useContext(ScaleContext);
  if (scale === undefined) {
    throw new Error("useScale must be used within a ScaleContextProvider");
  }
  return scale;
}
