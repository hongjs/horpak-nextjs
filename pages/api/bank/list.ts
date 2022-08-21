import type { NextApiRequest, NextApiResponse } from 'next';
import { withActiveAuth } from 'middleware';
import { connectToDatabase } from 'lib/mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { db } = await connectToDatabase();
    const bankAccounts = await db.collection('bankAccounts').find({}).toArray();
    res.json(bankAccounts);
  }
};

export default withActiveAuth(handler);
