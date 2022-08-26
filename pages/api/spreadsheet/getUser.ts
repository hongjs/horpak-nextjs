import type { NextApiRequest, NextApiResponse } from 'next';
import { withActiveAuth } from 'middleware';
import clientPromise from 'lib/mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const client = await clientPromise;
    const db = client.db('cplace-cluster');
    const user = await db
      .collection('configs2')
      .findOne({ group: 'google', name: 'user' });

    const token = await db
      .collection('configs2')
      .findOne({ group: 'google', name: 'token' });

    if (user) {
      res.send({
        name: user.value.name,
        picture: user.value.picture,
        email: user.value.email,
        updatedBy: user.updatedBy,
        updatedDate: user.updatedDate,
        expiryDate: new Date(token?.value.expiry_date * 1000),
      });
    } else {
      res.send({});
    }
  }
};

export default withActiveAuth(handler);
