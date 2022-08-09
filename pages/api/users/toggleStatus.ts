import type { NextApiRequest, NextApiResponse } from 'next';
import { validSession } from '../auth/[...nextauth]';
import { db } from 'lib/firebaseUtil';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      await validSession(req, res);

      const { id } = req.body;
      const snapshot = await db.collection('users').doc(id).get();
      const user = snapshot.data();
      if (user && !user.admin) {
        const isActive = user?.active || false;
        await db.collection('users').doc(id).update({ active: !isActive });
        res.send(true);
      } else {
        res.send(false);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
};

export default handler;
