import type { NextApiRequest, NextApiResponse } from 'next';
import { withActiveAuth } from 'middleware';
import clientPromise from 'lib/mongodb';
import { getAccessToken } from 'lib/mongoUtil';
import { setCredentials, getSheetDataForReport } from 'lib/spreadsheetUtil';
import validateReport from 'lib/validator';
import keys from 'config/keys';
import { ReportItem } from 'types/state';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { spreadSheetId, sheetId } = req.query as unknown as {
      spreadSheetId: string;
      sheetId: number;
    };
    const client = await clientPromise;
    const db = client.db(keys.dbName);

    const mapping = await db.collection('configs').findOne({
      group: 'google',
      name: 'column_mapping',
    });

    setCredentials(await getAccessToken());
    const data = await getSheetDataForReport(spreadSheetId, sheetId);
    if (data && data.values && mapping) {
      const tranformed = transformData(data.values, mapping.value);

      const errors = validateReport(tranformed);

      if (errors && errors.length > 0) {
        res.send({ sheet: data.sheet, items: tranformed, errors });
      } else {
        res.send({ sheet: data.sheet, items: tranformed });
      }
    } else {
      res.status(500).send('');
    }
  }
};

const transformData: TransformDataFunc = (data, mapping) => {
  const columns = data[0];
  const newData: ReportItem[] = [];
  for (let i = 1; i < data.length; i++) {
    let obj: any = {};
    for (let j = 0; j < data[i].length; j++) {
      const _colName: string = columns[j];
      const _colValue: string = mapping[_colName as keyof typeof mapping];
      obj[_colValue as keyof typeof obj] = data[i][j];
    }
    newData.push(obj);
  }
  return newData;
};

type TransformDataFunc = (data: any[][], mapping: any) => ReportItem[];

export default withActiveAuth(handler);
