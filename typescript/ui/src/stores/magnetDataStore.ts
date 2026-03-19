import { create } from 'zustand';
import type { MagnetData } from '../types/magnet';
import magnetConfig from '../config/magnets.json';

interface MagnetDataStore {
  magnets: MagnetData[];
  getMagnet: (uuid: string) => MagnetData | undefined;
}

export const useMagnetDataStore = create<MagnetDataStore>((_, get) => ({
  magnets: magnetConfig as MagnetData[],
  getMagnet: (uuid: string) => get().magnets.find((m) => m.uuid === uuid),
}));
