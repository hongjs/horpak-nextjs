import type { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from 'middleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    res.status(404).send('Not found');
  }
};

export default withAuth(handler);
