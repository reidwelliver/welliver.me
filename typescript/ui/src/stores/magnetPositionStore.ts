import { create } from "zustand";

import type {
  MagnetPosition,
  MagnetPositionMap,
} from "@welliver-me/ui/types/magnet";
import magnetConfig from "@welliver-me/ui/config/magnets.json";
import { magnetManagerInstance as manager } from "@welliver-me/ui/workers/Magnet";

const initialPositions: MagnetPositionMap = magnetConfig.reduce((acc, mag) => {
  acc[mag.uuid] = mag.start_pos;
  return acc;
}, {} as MagnetPositionMap);

interface MagnetPositionStore {
  ready: boolean;
  initializing: boolean;

  positions: MagnetPositionMap;
  owners: Record<string, string | null>;
  setPosition: (uuid: string, position: MagnetPosition) => void;
  setOwner: (uuid: string, owner: string | null) => void;
  getPosition: (uuid: string) => MagnetPosition | undefined;
}

export const useMagnetPositionStore = create<MagnetPositionStore>(
  (set, get) => {
    const initMagnetManager = async () => {
      const ready = await manager.ready;
      set(() => ({
        initializing: false,
        ready,
      }));
    };

    initMagnetManager();

    return {
      initializing: true,
      ready: false,
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
    };
  },
);
