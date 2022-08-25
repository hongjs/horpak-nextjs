import { MongoClient } from 'mongodb';

// /global.d.ts
declare global {
  var mongoClient: MongoClient;
}

export {};
