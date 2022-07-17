import { AzureFunction, Context } from "@azure/functions";

const tileFetch: AzureFunction = async function (
  context: Context
): Promise<void> {
  const tilesFromCosmos = context.bindings.inputTileDocuments ?? [];

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: JSON.stringify(tilesFromCosmos),
  };
};

export default tileFetch;
