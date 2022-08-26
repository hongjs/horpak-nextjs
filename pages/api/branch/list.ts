import type { NextApiRequest, NextApiResponse } from 'next';
import { withActiveAuth } from 'middleware';
import clientPromise from 'lib/mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const client = await clientPromise;
    const db = client.db('cplace-cluster');

    const branches = await db.collection('branches').find({}).toArray();

    res.json(branches);
  }
};

export default withActiveAuth(handler);
