import type { NextApiRequest, NextApiResponse } from 'next';
import { db, checkAdmin } from 'lib/firebaseUtil';
import { withActiveAuth } from 'middleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { id } = req.body;
      const noAdmin = await checkAdmin();

      const snapshot = await db.collection('users').doc(id).get();
      const user = snapshot.data();
      if (user) {
        const isActive = user?.active || false;

        // if there is no Admin, assign admin to the first active user
        const update = noAdmin
          ? { active: true, admin: true }
          : { active: !isActive };
        await db.collection('users').doc(id).update(update);
        res.send(true);
      } else {
        res.send(false);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
};

export default withActiveAuth(handler);
