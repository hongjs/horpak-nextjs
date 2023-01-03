import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { withActiveAuth } from 'middleware';
import clientPromise from 'lib/mongodb';
import { setCredentials, processSheet } from 'lib/spreadsheetUtil';
import { getAccessToken } from 'lib/mongoUtil';
import keys from 'config/keys';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { branchId, spreadsheetId, sheetId } = req.query;
    try {
      const client = await clientPromise;
      const db = client.db(keys.DB_NAME);
      const updateInfo = await db.collection('sheetInfos').find({}).toArray();
      const email = await db.collection('configs').findOne({
        group: 'google',
        name: 'driveOwnerEmail',
      });

      setCredentials(await getAccessToken());
      const updatedSheets = await processSheet(
        spreadsheetId as string,
        Number(sheetId),
        email ? email.value : '',
        updateInfo as any
      );

      await db
        .collection('branches')
        .updateOne(
          { _id: new ObjectId(branchId as string) },
          { $set: { lastProcessSheet: new Date() } }
        );

      res.send({ branchId, updatedSheets });
    } catch (err) {
      res.status(500).send(err);
    }
  }
};

export default withActiveAuth(handler);
