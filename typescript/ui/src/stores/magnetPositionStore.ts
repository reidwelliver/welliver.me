import { create } from "zustand";
import type { MagnetPosition, MagnetPositionMap } from "../types/magnet";
import magnetConfig from "../config/magnets.json";

const initialPositions: MagnetPositionMap = magnetConfig.reduce((acc, mag) => {
  acc[mag.uuid] = mag.start_pos;
  return acc;
}, {} as MagnetPositionMap);

interface MagnetPositionStore {
  positions: MagnetPositionMap;
  owners: Record<string, string | null>;
  setPosition: (uuid: string, position: MagnetPosition) => void;
  setOwner: (uuid: string, owner: string | null) => void;
  getPosition: (uuid: string) => MagnetPosition | undefined;
}

export const useMagnetPositionStore = create<MagnetPositionStore>(
  (set, get) => ({
    positions: initialPositions,
    owners: {},
    setPosition: (uuid, position) => {
      return set((state) => ({
        positions: { ...state.positions, [uuid]: position },
      }));
    },
    setOwner: (uuid, owner) => {
      return set((state) => ({
        owners: { ...state.owners, [uuid]: owner },
      }));
    },
    getPosition: (uuid) => get().positions[uuid],
  }),
);
