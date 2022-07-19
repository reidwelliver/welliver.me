import { ReactNode } from "react";

export interface BackendTile {
  id: string;
  x: number;
  y: number;
}

interface TileSize {
  h: number;
  w: number;
}

export interface FrontendTile extends BackendTile, TileSize {
  animated: boolean;
  children: ReactNode;
  classes: string;
}

export interface TileDataGridProps extends TileSize {
  i: string;
  x: number;
  y: number;
}

export function tilePropsToDataGridProps(tileProps: FrontendTile) {
  const { h, id, w, x, y } = tileProps;
  return { h, i: id, w, x, y } as TileDataGridProps;
}
