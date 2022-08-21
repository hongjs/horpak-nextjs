import type { NextApiRequest, NextApiResponse } from 'next';
import { withActiveAuth } from 'middleware';
import { connectToDatabase } from 'lib/mongodb';
import { ObjectId } from 'mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'DELETE') {
    const { id } = req.query as { id: string };

    if (!ObjectId.isValid(id as string)) {
      res.status(400).send({ status: 'Invalid parameters, require [id]' });
      return;
    }

    const { db } = await connectToDatabase();
    await db.collection('bankAccounts').deleteOne({ _id: new ObjectId(id) });
    res.send({ id });
  }
};

export default withActiveAuth(handler);
