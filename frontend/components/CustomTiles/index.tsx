import { ComponentType } from "react";
import { FrontendTile } from "@welliver.me/tile";
import TitleTile from "./TitleTile";

// TODO: fill out with custom tiles
const customTilesById: Record<string, ComponentType<FrontendTile>> = {
  title: TitleTile,
};

export default customTilesById;
