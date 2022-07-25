import React from "react";

import {
  NUM_TILE_LAYOUT_ROWS,
  NUM_TILE_LAYOUT_COLS,
} from "@welliver.me/tile/config";

export default function TitleTile() {
  return (
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
}

export function getTitleTitleConfig() {
  const pageTitleTile = {
    y: 0,
    x: 0,
    w: 26,
    h: 22,
    i: "title",
    id: "title",
    classes: "title-tile",
    static: true,
    animated: false,
  };

  pageTitleTile.y = NUM_TILE_LAYOUT_ROWS - (pageTitleTile.h + 1);
  pageTitleTile.x = NUM_TILE_LAYOUT_COLS - (pageTitleTile.w + 1);

  return pageTitleTile;
}
