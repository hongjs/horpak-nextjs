import { MongoClient, MongoClientOptions } from "mongodb";
import keys from "config/keys";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// https://github.com/vercel/next.js/blob/canary/examples/with-mongodb/lib/mongodb.ts

if (!keys.MONGO_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

if (!keys.DB_NAME) {
  throw new Error(
    "Please define the MONGODB_DB environment variable inside .env.local",
  );
}

const options = {
  appName: keys.NODE_ENV,
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as MongoClientOptions;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global.mongoClientPromise) {
    client = new MongoClient(keys.MONGO_URI, options);
    global.mongoClientPromise = client.connect();
  }

  clientPromise = global.mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(keys.MONGO_URI, options);
  clientPromise = client.connect();
}
export default clientPromise;

// let cachedClient: MongoClient;
// let cachedDb: Db;

// export const connectToDatabase = async (): Promise<MongoClientType> => {
//   if (cachedClient && cachedDb) {
//     return { client: cachedClient, db: cachedDb };
//   }

//   const options = {
//     appName: keys.NODE_ENV,
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   } as MongoClientOptions;

//   const client = await MongoClient.connect(keys.MONGO_URI, options);
//   const db = await client.db(keys.DB_NAME);

//   cachedClient = client;
//   cachedDb = db;

//   return { client: cachedClient, db: cachedDb };
// };
