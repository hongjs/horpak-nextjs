import type { NextApiRequest, NextApiResponse } from 'next';
import { withActiveAuth } from 'middleware';
import { getAccessToken } from 'lib/mongoUtil';
import { setCredentials, listFile, getFile } from 'lib/spreadsheetUtil';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const folderId = req.query.folderId
      ? req.query.folderId.toString()
      : 'root';

    setCredentials(await getAccessToken());
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
