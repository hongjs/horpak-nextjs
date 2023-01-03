import type { NextApiRequest, NextApiResponse } from 'next';
import { withActiveAuth } from 'middleware';
import clientPromise from 'lib/mongodb';
import { ObjectId } from 'mongodb';
import keys from 'config/keys';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'DELETE') {
    const { id } = req.query as { id: string };

    if (!ObjectId.isValid(id)) {
      res.status(400).send({ status: 'Invalid parameters, require [id]' });
      return;
    }

    const client = await clientPromise;
    const db = client.db(keys.DB_NAME);
    await db.collection('bankAccounts').deleteOne({ _id: new ObjectId(id) });
    res.send({ id });
  }
};

export default withActiveAuth(handler);
