import { AzureFunction, Context } from "@azure/functions";
import { TILES, sparseTilesToBackendTiles } from "@welliver.me/tile";

import recreateContainer from "./recreateContainer";

const tileReseed: AzureFunction = async function (
  context: Context
): Promise<void> {
  context.log("Seeding Database With Tiles");

  await recreateContainer();

  const backendTiles = sparseTilesToBackendTiles(TILES);

  context.bindings.outputTileDocuments = JSON.stringify(backendTiles);

  context.res = {
    body: JSON.stringify({ tilesSeeded: backendTiles.length }),
  };
};

export default tileReseed;
