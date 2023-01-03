import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from 'lib/firebaseUtil';
import { withAuth } from 'middleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const { email } = req.query;
      const snapshot = await db
        .collection('users')
        .where('email', '==', email)
        .get();
      if (snapshot.size > 0) {
        res.send(snapshot.docs[0].data());
      } else {
        res.send(null);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
};

export default withAuth(handler);
