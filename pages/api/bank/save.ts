import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { withActiveAuth } from 'middleware';
import clientPromise from 'lib/mongodb';
import { FindOneAndUpdateOptions, ObjectId } from 'mongodb';
import keys from 'config/keys';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { _id, bankId, bankName, accountNo, accountName, remark } = req.body;

    if (_id && !ObjectId.isValid(_id)) {
      res.status(400).send({ status: 'Invalid parameters, require [id]' });
      return;
    }

    const client = await clientPromise;
    const db = client.db(keys.dbName);
    const session = await getSession({ req });

    if (_id) {
      const result = await db.collection('bankAccounts').findOneAndUpdate(
        { _id: new ObjectId(_id) },
        {
          $set: {
            bankId,
            bankName,
            accountNo,
            accountName,
            remark,
            modifiedBy: session?.user?.email,
            modifiedDate: new Date(),
          },
        },
        { returnOriginal: false } as FindOneAndUpdateOptions
      );
      res.send(result.value);
    } else {
      const obj = {
        bankId,
        bankName,
        accountNo,
        accountName,
        remark,
        modifiedBy: session?.user?.email,
        modifiedDate: new Date(),
      };
      const result = await db.collection('bankAccounts').insertOne(obj);
      res.send({ _id: result.insertedId, ...obj });
    }
  }
};

export default withActiveAuth(handler);
