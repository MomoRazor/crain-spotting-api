if (!process.env.MONGO_CLUSTER_ENDPOINT)
  throw new Error("MONGO_CLUSTER_ENDPOINT variable is missing!");

if (!process.env.MONGO_DB) throw new Error("MONGO_DB variable is missing!");

if (!process.env.MONGO_PASSWORD)
  throw new Error("MONGO_PASSWORD variable is missing!");

if (!process.env.MONGO_USERNAME)
  throw new Error("MONGO_USERNAME variable is missing!");

export const MONGO_CONNECTION_STRING = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER_ENDPOINT}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
