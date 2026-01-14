import { MongoClient } from "mongodb";

// /global.d.ts
declare global {
  var mongoClientPromise: Promise<MongoClient>;
}

export {};
