import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from 'lib/firebaseUtil';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { email } = req.query;
    try {
      const snapshot = await db
        .collection('users')
        .where('email', '==', email)
        .get();
      if (snapshot.size > 0) {
        res.send(snapshot.docs[0].data());
      } else {
        res.send({});
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
};

export default handler;
