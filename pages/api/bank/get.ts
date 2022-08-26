import type { NextApiRequest, NextApiResponse } from 'next';
import { withActiveAuth } from 'middleware';
import clientPromise from 'lib/mongodb';
import { ObjectId } from 'mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { id } = req.query as { id: string };
    if (!ObjectId.isValid(id)) {
      res.status(400).send({ status: 'Invalid parameters, require [id]' });
      return;
    }

    const client = await clientPromise;
    const db = client.db('cplace-cluster');
    const item = await db
      .collection('bankAccounts')
      .findOne({ _id: new ObjectId(id) });
    res.send(item);
  }
};

export default withActiveAuth(handler);
