import type { NextApiRequest, NextApiResponse } from 'next';
import { withActiveAuth } from 'middleware';
import { connectToDatabase } from 'lib/mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { db } = await connectToDatabase();
    const items = await db
      .collection('bankAccounts')
      .find({})
      .project({ _id: 1 })
      .toArray();
    res.send(items.map((i) => i._id));
  }
};

export default withActiveAuth(handler);
