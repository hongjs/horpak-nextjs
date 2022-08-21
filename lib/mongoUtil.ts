import { connectToDatabase } from './mongodb';

export const getIds = async (collectionName: string, field?: string) => {
  const _field = field ? field : '_id';
  const { db } = await connectToDatabase();
  const items = await db
    .collection(collectionName)
    .find({})
    .project({ [_field]: 1 })
    .toArray();
  return items.map((i) => {
    return i[_field].toString();
  });
};
