import { CosmosClient } from "@azure/cosmos";

const DATABASE_NAME = "welliverme";
const CONTAINER_NAME = "tiles";

export default async function recreateContainer() {
  const connectionString = process.env["CosmosDbConnectionString"];
  if (!connectionString) {
    throw new Error("Missing Cosmos connection string in ENV");
  }
  const client = new CosmosClient(connectionString);
  const { database } = await client.databases.createIfNotExists({
    id: DATABASE_NAME,
  });

  const container = database.container(CONTAINER_NAME);

  if (container) {
    await container.delete();
  }

  await database.containers.createIfNotExists({
    id: CONTAINER_NAME,
    partitionKey: "/id",
  });
}
