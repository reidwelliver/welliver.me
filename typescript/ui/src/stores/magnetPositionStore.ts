import { create } from "zustand";
import type { MagnetPosition } from "../types/magnet";

interface MagnetPositionStore {
  positions: Record<string, MagnetPosition>;
  owners: Record<string, string | null>;
  setPosition: (uuid: string, position: MagnetPosition) => void;
  setOwner: (uuid: string, owner: string | null) => void;
  getPosition: (uuid: string) => MagnetPosition | undefined;
}

export const useMagnetPositionStore = create<MagnetPositionStore>(
  (set, get) => ({
    positions: {},
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
