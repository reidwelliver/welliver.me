import React, { useMemo } from "react";
import ReactGridLayout, { ReactGridLayoutProps } from "react-grid-layout";
import { withSize } from "react-sizeme";

import useTiles from "@welliver.me/frontend/hooks/useTiles";
import { TileDataGridProps, tilePropsToDataGridProps } from "@welliver.me/tile";

import { makeTile } from "./Tile";

import "@welliver.me/frontend/style/GridLayout.scss";

const settings: ReactGridLayoutProps = {
  className: "layout",
  cols: 100,
  autoSize: false,
  rowHeight: 10,
  compactType: null,
  isResizable: false,
  isDraggable: true,
  isBounded: true,
  resizeHandles: [],
  preventCollision: true,
  margin: [5, 5],
};

const pageTitleChild = (
  <div className="funky-title">
    <div className="top-title">
      <span className="firstname">R</span>
      <span className="tiny-title">eid</span>
    </div>
    <div className="bottom-title">
      <span className="lastname">W</span>
      <span className="tiny-title">elliver</span>
    </div>
  </div>
);

function getPageTitle(numRows: number) {
  const pageTitleTile = {
    y: 0,
    x: 88,
    w: 12,
    h: 12,
    i: "title",
    id: "title",
    classes: "title-tile",
    children: pageTitleChild,
    static: true,
    animated: false,
  };

  pageTitleTile.y = numRows - pageTitleTile.h;

  return pageTitleTile;
}

// function generateTestLayout(numRows: number) {
//   const testTiles = new Array(numRows).fill(true).map((item, i) => {
//     const y = Math.ceil(Math.random() * 4) + 1;
//     return {
//       x: (i * 2) % 100,
//       y: Math.floor(i / 6) * y,
//       w: 10,
//       h: 3,
//       i: i.toString(),
//       classes: "",
//       children: <span className="text">Tile {i.toString()}</span>,
//       animated: true,
//     };
//   });

//   return [pageTitleTile, ...testTiles];
// }

interface TileLayoutProps {
  height?: number;
  width?: number;
}

function TileLayout(props: TileLayoutProps) {
  const { tiles, updateTile } = useTiles();

  const onDragStop = (
    _l: TileDataGridProps[],
    _old: TileDataGridProps,
    newTile: TileDataGridProps
  ) => {
    updateTile(newTile);
  };

  const width = props.width || window.innerWidth;
  const height = props.height || window.innerHeight;

  let numRows = Math.floor(
    height / (settings.rowHeight! + settings.margin![0])
  );

  const pageTitleChild = useMemo(() => getPageTitle(numRows), [numRows]);

  const onTileClick = (id: string) => {
    console.log("aaaaa", id);
  };

  const layout = useMemo(
    () => [...tiles.map(tilePropsToDataGridProps), pageTitleChild],
    [tiles, pageTitleChild]
  );

  return (
    <ReactGridLayout
      onDragStop={onDragStop}
      width={width}
      {...settings}
      layout={layout}
    >
      {tiles.map((tile) => makeTile({ ...tile, onTileClick }))}
      {makeTile(pageTitleChild)}
    </ReactGridLayout>
  );
}

export default withSize({ monitorHeight: true })(TileLayout);
