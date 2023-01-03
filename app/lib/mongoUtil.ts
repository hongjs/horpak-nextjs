import clientPromise from './mongodb';
import keys from 'config/keys';

export const getIds = async (collectionName: string, field?: string) => {
  const _field = field ? field : '_id';
  const client = await clientPromise;
  const db = client.db(keys.DB_NAME);
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

  const client = await clientPromise;
  const db = client.db(keys.DB_NAME);

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

export const getAccessToken = async () => {
  const client = await clientPromise;
  const db = client.db(keys.DB_NAME);

  const tokens = await db
    .collection('configs2')
    .find({ group: 'google', name: 'token' })
    .toArray();
  if (tokens.length > 0) {
    return tokens[0].value;
  }
  return null;
};
