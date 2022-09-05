import type { NextApiRequest, NextApiResponse } from 'next';
import { withActiveAuth } from 'middleware';
import { setCredentials, listSheets } from 'lib/spreadsheetUtil';
import { getAccessToken } from 'lib/mongoUtil';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { id } = req.query;
    try {
      setCredentials(await getAccessToken());
      const sheets = await listSheets(id as string);
      res.send(sheets);
    } catch (err) {
      res.status(500).send(err);
    }
  }
};

export default withActiveAuth(handler);
