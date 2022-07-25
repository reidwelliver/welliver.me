import React, { useMemo } from "react";
import ReactGridLayout, { ReactGridLayoutProps } from "react-grid-layout";
import { withSize } from "react-sizeme";

import useTiles from "@welliver.me/frontend/hooks/useTiles";
import { TileDataGridProps, tilePropsToDataGridProps } from "@welliver.me/tile";
import {
  NUM_TILE_LAYOUT_ROWS,
  NUM_TILE_LAYOUT_COLS,
} from "@welliver.me/tile/config";
import { getTitleTitleConfig } from "./CustomTiles/TitleTile";
import { makeTile } from "./Tile";

import "@welliver.me/frontend/style/GridLayout.scss";

const MIN_COL_WIDTH_PX = 5;
const MIN_TOTAL_WIDTH_PX = MIN_COL_WIDTH_PX * NUM_TILE_LAYOUT_COLS;

const MIN_ROW_HEIGHT_PX = 4;

const settings: ReactGridLayoutProps = {
  className: "layout",
  cols: NUM_TILE_LAYOUT_COLS,
  autoSize: false,
  compactType: null,
  isResizable: false,
  isDraggable: true,
  isBounded: true,
  resizeHandles: [],
  preventCollision: true,
  margin: [1, 1],
};

function TileLayout() {
  const { tiles, updateTile } = useTiles();

  const onDragStop = (
    _l: TileDataGridProps[],
    _old: TileDataGridProps,
    newTile: TileDataGridProps
  ) => {
    updateTile(newTile);
  };

  // have a standard number of rows and columns
  // get the width and height of the window

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const widthScaleFactor = windowWidth / MIN_TOTAL_WIDTH_PX;
  const calculatedWidth =
    widthScaleFactor > 1 ? windowWidth : MIN_TOTAL_WIDTH_PX;

  const onTileClick = (id: string) => {
    console.log("aaaaa", id);
  };

  const calculatedRowHeight = windowHeight / NUM_TILE_LAYOUT_ROWS;
  const rowHeight =
    calculatedRowHeight >= MIN_ROW_HEIGHT_PX
      ? calculatedRowHeight
      : MIN_ROW_HEIGHT_PX;

  console.log(rowHeight);

  const titleTileConfig = useMemo(() => getTitleTitleConfig(), []);

  const layout = useMemo(
    () => [...tiles.map(tilePropsToDataGridProps), titleTileConfig],
    [tiles, titleTileConfig]
  );

  return (
    <ReactGridLayout
      {...settings}
      onDragStop={onDragStop}
      width={calculatedWidth}
      rowHeight={rowHeight}
      layout={layout}
    >
      {tiles.map((tile) => makeTile({ ...tile, onTileClick }))}
      {makeTile(titleTileConfig)}
    </ReactGridLayout>
  );
}

export default withSize({ monitorHeight: true })(TileLayout);
