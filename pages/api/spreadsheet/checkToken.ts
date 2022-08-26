import type { NextApiRequest, NextApiResponse } from 'next';
import { withActiveAuth } from 'middleware';
import clientPromise from 'lib/mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const client = await clientPromise;
    const db = client.db('cplace-cluster');
    const tokens = await db
      .collection('configs2')
      .find({ group: 'google', name: 'token' })
      .toArray();
    if (
      tokens.length === 0 ||
      !tokens[0].value ||
      !tokens[0].value.access_token
    ) {
      res.send(false);
      return;
    }
    res.send(true);
  }
};

export default withActiveAuth(handler);
