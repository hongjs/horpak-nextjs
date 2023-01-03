import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from 'lib/firebaseUtil';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const snapshot = await db
        .collection('users')
        .where('admin', '==', true)
        .get();

      res.send(snapshot.size === 0);
    } catch (error) {
      res.status(500).send(error);
    }
  }
};

export default handler;
