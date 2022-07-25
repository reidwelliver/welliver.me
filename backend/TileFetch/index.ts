import { AzureFunction, Context } from "@azure/functions";
import { BackendTile } from "@welliver.me/tile";

const tileFetch: AzureFunction = async function (
  context: Context
): Promise<void> {
  const tilesFromCosmos = (context.bindings.inputTileDocuments ??
    []) as BackendTile[];

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: JSON.stringify(tilesFromCosmos),
  };
};

export default tileFetch;
