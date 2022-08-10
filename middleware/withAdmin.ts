import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getUser } from 'lib/firebaseUtil';

const withAdmin = (handler: any) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });
    if (!session || !session.user) {
      res.status(401).send('Unauthorized');
      return;
    }

    try {
      const { email } = session.user;
      const user = email ? await getUser(email) : null;
      if (!user || !user.active || !user.admin) {
        res.status(401).send('Unauthorized');
        return;
      }

      return handler(req, res);
    } catch (error) {
      res.status(500).send(error);
    }
  };
};

export default withAdmin;
