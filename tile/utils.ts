import {
  BackendTile,
  FrontendTile,
  TileDataGridProps,
  SparseTile,
} from "./types";
import { NUM_TILE_LAYOUT_ROWS, NUM_TILE_LAYOUT_COLS } from "./config";
import { TILES as SPARSE_TILES } from "./tiles";

export function tilePropsToDataGridProps(tileProps: FrontendTile) {
  const { h, id, w, x, y } = tileProps;
  return { h, i: id, w, x, y } as TileDataGridProps;
}

export function sparseTilesToBackendTiles(tiles: SparseTile[]): BackendTile[] {
  return tiles.map((tile, i) => {
    return {
      id: tile.id,
      x: tile.x ?? (i * 4) % NUM_TILE_LAYOUT_COLS,
      y: tile.y ?? i % NUM_TILE_LAYOUT_ROWS,
    };
  });
}

export function guessTileWidthFromContent(content: string) {
  const windowWidth = window.innerWidth;
  const extraPaddingForSmallDevices = Math.floor(8 - windowWidth / 1000);
  return Math.ceil(content.length * 1.25) + extraPaddingForSmallDevices;
}

export function backendTileToFrontendTile(
  backendTile: BackendTile
): FrontendTile {
  const sparseTile = SPARSE_TILES.find((t) => t.id === backendTile.id) ?? {};
  return {
    w: guessTileWidthFromContent(backendTile.id),
    h: 3,
    animated: true,
    classes: "tile",
    ...sparseTile,
    ...backendTile,
  };
}

// function generateTestLayout(numRows: number) {
//   const testTiles = new Array(numRows).fill(true).map((item, i) => {
//     const y = Math.ceil(Math.random() * 4) + 1;
//     return {
//       x: (i * 2) % 100,
//       y: Math.floor(i / 6) * y,
//     };
//   });

//   return testTiles;
// }
