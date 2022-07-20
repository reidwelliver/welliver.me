interface TileSize {
  h: number;
  w: number;
}

interface TilePosition {
  x: number;
  y: number;
}

export interface BackendTile extends TilePosition {
  id: string;
}

export interface FrontendTile extends BackendTile, TileSize {
  animated: boolean;
  classes: string;
}

// we can define tiles with as little as just an ID
// we will assume the ID is the child to be shown if there's nothing else
export interface SparseTile extends Partial<Omit<FrontendTile, "id">> {
  id: string;
}

export interface TileDataGridProps extends TileSize, TilePosition {
  i: string;
}
