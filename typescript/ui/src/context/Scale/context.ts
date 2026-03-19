import { createContext } from "react";
import type { ScaleState } from "../../types/scale";

export const ScaleContext = createContext<ScaleState | undefined>(undefined);
