import type { NextApiRequest, NextApiResponse } from 'next';
import { withActiveAuth } from 'middleware';
import { connectToDatabase } from 'lib/mongodb';
import { setCredentials, listFile, getFile } from 'lib/spreadsheetUtil';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const folderId = req.query.folderId
      ? req.query.folderId.toString()
      : 'root';
    const { db } = await connectToDatabase();
    const tokens = await db
      .collection('configs2')
      .find({ group: 'google', name: 'token' })
      .toArray();
    if (tokens.length === 0) {
      res.status(500).send('No Access Token found.');
      return;
    }
    setCredentials(tokens[0].value);
    let files = await listFile(folderId);

    if (folderId !== 'root' && files.length > 0 && files[0].parents) {
      const file = await getFile(files[0].parents[0]);
      if (file && file.name !== 'My Drive' && file.parents) {
        files = [
          { id: file.parents[0], name: '..', mimeType: file.mimeType },
          ...files,
        ];
      }
    } else if (folderId !== 'root' && files.length === 0) {
      files.push({
        id: 'root',
        name: '..',
        mimeType: 'application/vnd.google-apps.folder',
      });
    }
    res.send(files);
  }
};

export default withActiveAuth(handler);
