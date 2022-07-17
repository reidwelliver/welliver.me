import { AzureFunction, Context } from "@azure/functions";
import TileSamples from "./TileSamples";
import recreateContainer from "./recreateContainer";

const tileReseed: AzureFunction = async function (
  context: Context
): Promise<void> {
  context.log("Seeding Database With Tiles");

  await recreateContainer();

  context.bindings.outputTileDocuments = JSON.stringify(TileSamples);

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: JSON.stringify({ tilesSeeded: TileSamples.length }),
  };
};

export default tileReseed;
