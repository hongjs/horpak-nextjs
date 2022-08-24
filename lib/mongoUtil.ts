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

export const saveDriveToken = async (
  token: any,
  userInfo: any,
  currentUser: string
) => {
  if (!token || !userInfo) return;

  const { db } = await connectToDatabase();

  await db.collection('configs2').replaceOne(
    { group: 'google', name: 'token' },
    {
      group: 'google',
      name: 'token',
      value: token,
      updatedBy: currentUser,
      updatedDate: new Date(),
    },
    {
      upsert: true,
    }
  );

  await db.collection('configs2').replaceOne(
    { group: 'google', name: 'user' },
    {
      group: 'google',
      name: 'user',
      value: userInfo,
      updatedBy: currentUser,
      updatedDate: new Date(),
    },
    {
      upsert: true,
    }
  );
};
