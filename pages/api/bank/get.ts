import type { NextApiRequest, NextApiResponse } from 'next';
import { withActiveAuth } from 'middleware';
import { connectToDatabase } from 'lib/mongodb';
import { ObjectId } from 'mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { id } = req.query as { id: string };
    if (!ObjectId.isValid(id)) {
      res.status(400).send({ status: 'Invalid parameters, require [id]' });
      return;
    }

    const { db } = await connectToDatabase();
    const item = await db
      .collection('bankAccounts')
      .findOne({ _id: new ObjectId(id) });
    res.send(item);
  }
};

export default withActiveAuth(handler);
