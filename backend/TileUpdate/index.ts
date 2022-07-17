import { AzureFunction, Context, HttpRequest } from "@azure/functions";

function validateTileFromRequest(req: HttpRequest) {
  const { id, x, y } = req.body;

  if (id !== undefined && x !== undefined && y !== undefined) {
    return { id, x, y };
  }

  return false;
}

const tileUpdateFunction: AzureFunction = async function (
  context: Context,
  req: HttpRequest
) {
  const tileUpdates = validateTileFromRequest(req);
  const oldTile = context.bindings.inputTileDocument;

  if (!tileUpdates || !oldTile) {
    context.res = {
      status: 422,
      body: JSON.stringify({ error: "unable to find tile" }),
    };
    context.log("unable to find tile, sending error to Frontend");
    return;
  }

  const newTile = {
    ...oldTile,
    ...tileUpdates,
  };

  context.bindings.outputTileDocument = JSON.stringify(newTile);
  context.bindings.signalRMessages = [
    {
      target: "tileUpdate",
      arguments: [JSON.stringify(newTile)],
    },
  ];
};

export default tileUpdateFunction;
