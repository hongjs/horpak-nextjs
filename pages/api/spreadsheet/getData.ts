import type { NextApiRequest, NextApiResponse } from 'next';
import { withActiveAuth } from 'middleware';
import clientPromise from 'lib/mongodb';
import { getAccessToken } from 'lib/mongoUtil';
import { setCredentials, getSheetDataForReport } from 'lib/spreadsheetUtil';
import validateReport from 'lib/validator';
import keys from 'config/keys';
import { sheets_v4 } from 'googleapis';
import { ReportItem } from 'types/state';

type Query = { spreadSheetId: string; sheetId: number };

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
      data.values = tranformed as any[];

      const errors = validateReport(tranformed);
      if (errors && errors.length > 0) {
        res.send({ ...data, errors });
      } else {
        res.send(data);
      }
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

// const validateData = async (data: any[]) => {
//   const errors: ErrorType[] = [];

//   Promise.all(
//     data.map(async (i) => {
//       const schema = new reportSchema(i);
//       try {
//         await schema.validate();
//         if (schema.errors) {
//           for (var key in schema.errors) {
//             if (schema.errors.hasOwnProperty(key)) {
//               errors.push({
//                 room: i.room,
//                 column: schema.errors[key].path,
//                 message: schema.errors[key].message,
//               });
//             }
//           }
//         }
//       } catch (err) {
//         if (err.errors) {
//           for (var key in err.errors) {
//             if (err.errors.hasOwnProperty(key)) {
//               errors.push({
//                 room: i.room,
//                 column: err.errors[key].path,
//                 message: err.errors[key].message,
//               });
//             }
//           }
//         }
//       }
//     })
//   );
//   // await asyncForEach(data, async (i) => {
//   //   const schema = new reportSchema(i);
//   //   try {
//   //     await schema.validate();
//   //     if (schema.errors) {
//   //       for (var key in schema.errors) {
//   //         if (schema.errors.hasOwnProperty(key)) {
//   //           errors.push({
//   //             room: i.room,
//   //             column: schema.errors[key].path,
//   //             message: schema.errors[key].message,
//   //           });
//   //         }
//   //       }
//   //     }
//   //   } catch (err) {
//   //     if (err.errors) {
//   //       for (var key in err.errors) {
//   //         if (err.errors.hasOwnProperty(key)) {
//   //           errors.push({
//   //             room: i.room,
//   //             column: err.errors[key].path,
//   //             message: err.errors[key].message,
//   //           });
//   //         }
//   //       }
//   //     }
//   //   }
//   // });
//   return errors.length > 0 ? errors : undefined;
// };

type ErrorType = {
  room: number;
  column: string;
  message: string;
};

type TransformDataFunc = (data: any[][], mapping: any) => ReportItem[];

export default handler;
