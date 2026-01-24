import { MongoClient, Db } from 'mongodb'

export type MongoClientType = {
  client: MongoClient
  db: Db
}
