import { MongoClient, MongoClientOptions } from 'mongodb';
import keys from 'config/keys';
import { MongoClientType } from 'types/mongodb';

let cachedClient: any = null;
let cachedDb: any = null;

if (!keys.mongoURI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

if (!keys.dbName) {
  throw new Error(
    'Please define the MONGODB_DB environment variable inside .env.local'
  );
}

export const connectToDatabase = async (): Promise<MongoClientType> => {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as MongoClientOptions;

  const client = await MongoClient.connect(keys.mongoURI, options);

  const db = await client.db(keys.dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
};
