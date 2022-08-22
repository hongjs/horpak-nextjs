import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { withActiveAuth } from 'middleware';
import { connectToDatabase } from 'lib/mongodb';
import { FindOneAndUpdateOptions, ObjectId } from 'mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const {
      _id,
      name,
      spreadSheetId,
      spreadSheetName,
      lastProcessSheet,
      reportAddress,
      reportContact,
      reportHeader,
      reportRemark,
    } = req.body;

    if (_id && !ObjectId.isValid(_id)) {
      res.status(400).send({ status: 'Invalid parameters, require [id]' });
      return;
    }

    const { db } = await connectToDatabase();
    const session = await getSession({ req });

    if (_id) {
      const result = await db.collection('branches').findOneAndUpdate(
        { _id: new ObjectId(_id) },
        {
          $set: {
            name,
            spreadSheetId,
            spreadSheetName,
            lastProcessSheet,
            reportAddress,
            reportContact,
            reportHeader,
            reportRemark,
            modifiedBy: session?.user?.email,
            modifiedDate: new Date(),
          },
        },
        { returnOriginal: false } as FindOneAndUpdateOptions
      );
      res.send(result.value);
    } else {
      const obj = {
        name,
        spreadSheetId,
        spreadSheetName,
        lastProcessSheet,
        reportAddress,
        reportContact,
        reportHeader,
        reportRemark,
        modifiedBy: session?.user?.email,
        modifiedDate: new Date(),
      };
      const result = await db.collection('branches').insertOne(obj);
      res.send({ _id: result.insertedId, ...obj });
    }
  }
};

export default withActiveAuth(handler);
