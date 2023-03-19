import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from 'lib/firebaseUtil';
import { withAuth } from 'middleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    res.send({ active: true });
  }
};

export default handler;
