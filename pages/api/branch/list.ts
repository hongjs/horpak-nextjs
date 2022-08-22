import type { NextApiRequest, NextApiResponse } from 'next';
import { withActiveAuth } from 'middleware';
import { connectToDatabase } from 'lib/mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { db } = await connectToDatabase();
    const branches = await db.collection('branches').find({}).toArray();
    res.json(branches);
  }
};

export default withActiveAuth(handler);
