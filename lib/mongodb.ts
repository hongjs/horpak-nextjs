import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import keys from 'config/keys';
import { MongoClientType } from 'types/mongodb';

let cachedClient: MongoClient;
let cachedDb: Db;

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

const logConenction = async (db: Db, log: string) => {
  await db
    .collection('logs')
    .insertOne({ date: new Date(), env: keys.NODE_ENV, log: log });
};

export const connectToDatabase = async (): Promise<MongoClientType> => {
  if (cachedClient && cachedDb) {
    console.log('mongo: use cached connection');
    await logConenction(cachedDb, 'mongo: use cached connection');
    return { client: cachedClient, db: cachedDb };
  }

  console.log('mongo: new connection');

  const options: MongoClientOptions = {
    appName: keys.NODE_ENV,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as MongoClientOptions;

  const client = await MongoClient.connect(keys.mongoURI, options);
  const db = await client.db(keys.dbName);

  await logConenction(db, 'mongo: new connection');

  cachedClient = client;
  cachedDb = db;

  return { client: cachedClient, db: cachedDb };
};
