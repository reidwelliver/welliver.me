import { ReactNode } from "react";

export interface TileDataGridProps {
  h: number;
  i: string;
  w: number;
  x: number;
  y: number;
}

export interface Tile extends Omit<TileDataGridProps, "i"> {
  id: string;
  animated: boolean;
  children: ReactNode;
  classes: string;
}

export function tilePropsToDataGridProps(tileProps: Tile) {
  const { h, id, w, x, y } = tileProps;
  return { h, i: id, w, x, y } as TileDataGridProps;
}
