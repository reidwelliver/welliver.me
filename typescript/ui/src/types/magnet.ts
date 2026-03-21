export interface MagnetData {
  title: string;
  uuid: string;
  href: string;
  start_pos: { x: number; y: number };
  width: number;
  height: number;
}

export interface MagnetPosition {
  x: number;
  y: number;
}

export type MagnetPositionMap = Record<string, MagnetPosition>;
