import type { NextApiRequest, NextApiResponse } from 'next';
import { withActiveAuth } from 'middleware';
import { connectToDatabase } from 'lib/mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { db } = await connectToDatabase();
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
