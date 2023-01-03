import type { NextApiRequest, NextApiResponse } from 'next';
import { withActiveAuth } from 'middleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    res.status(404).send('Not found');
  }
};

export default withActiveAuth(handler);
