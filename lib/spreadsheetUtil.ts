import { find } from 'lodash';
import axois from 'axios';
import { google, drive_v3, sheets_v4, Auth } from 'googleapis';
import {} from 'date-fns';
import {
  OAuth2Client,
  OAuth2ClientOptions,
  GenerateAuthUrlOpts,
} from 'google-auth-library';
import keys from 'config/keys';
import { saveDriveToken } from './mongoUtil';

const options: OAuth2ClientOptions = {
  clientId: keys.GOOGLE_ID,
  clientSecret: keys.GOOGLE_SECRET,
  redirectUri: keys.googleRedirectUri,
};
// const credentials: Auth.Credentials = {
//   access_token: '',
// };

const client: OAuth2Client = new google.auth.OAuth2(options);
const SCOPES = [
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
];

// client.setCredentials(credentials);

const drive: drive_v3.Drive = google.drive({
  version: 'v3',
  auth: client,
} as drive_v3.Options);

const sheets = google.sheets({
  version: 'v4',
  auth: client,
} as sheets_v4.Options);

// constructor(client_id: string, client_secret: string, token: string) {
//   client = new google.auth.OAuth2(client_id, client_secret);
//   client.setCredentials(token);
//   drive:drive_v3.Drive   = google.drive({ version: 'v3', auth: client });
//   sheets = google.sheets({ version: 'v4', auth: client });
// }

export const generateAuthUrl: () => string = () => {
  const oAuth2Client = new google.auth.OAuth2(options);

  const authUrlOptions: GenerateAuthUrlOpts = {
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
  };
  const authUrl = oAuth2Client.generateAuthUrl(authUrlOptions);
  return authUrl;
};

export const auth = async (code: string, currentUser: string) => {
  try {
    const res = await client.getToken(decodeURIComponent(code));
    client.setCredentials(res.tokens);

    if (res.tokens && res.tokens?.access_token) {
      const user = await getUserProfile(res.tokens?.access_token);
      await saveDriveToken(res.tokens, user, currentUser);
    }
  } catch (err) {
    console.error('Error retrieving access token', err);
  }
};

export const setCredentials = (tokens: any) => {
  client.setCredentials(tokens);
};

const getUserProfile = async (token: string) => {
  const res = await axois.get(
    `https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${token}`
  );
  return res.data;
};

export const listFile = async (folder: string) => {
  if (!folder) folder = 'root';
  const res = await drive.files.list({
    pageSize: 100,
    fields: 'nextPageToken, files(id,name,mimeType,parents)',
    q: `'${folder}' in parents AND (mimeType = 'application/vnd.google-apps.spreadsheet' OR mimeType = 'application/vnd.google-apps.folder') AND trashed = false`,
  });
  return res.data.files ?? [];
};

export const getFile = async (fileId: string) => {
  const res = await drive.files.get({
    fileId: fileId,
    fields: 'id,name,mimeType,parents',
  });
  return res.data;
};

export const listSheets = async (spreadsheetId: string) => {
  const res = await sheets.spreadsheets.get({ spreadsheetId });
  if (res.data && res.data.sheets) {
    return res.data.sheets.map((sheet) => {
      return {
        sheetId: sheet.properties?.sheetId,
        title: sheet.properties?.title,
        index: sheet.properties?.index,
      };
    });
  } else {
    return [];
  }
};

export const getSpreadSheet = async (spreadsheetId: string) => {
  var res = await sheets.spreadsheets.get({ spreadsheetId });
  return res.data;
};

// const   processSheet = async (
//   spreadsheetId,
//   sourceSheetId,
//   ownerEmail,
//   updateInfo
// ) => {
//   // Retrieve sheet info
//   var spreadSheet = await getSpreadSheet(spreadsheetId);
//   var sheet = _.find(spreadSheet.sheets, (sheet) => {
//     return sheet.properties.sheetId === sourceSheetId;
//   });

//   // // Duplicate sheet
//   const { duplicateSheet } = await _duplicateSheet(
//     spreadsheetId,
//     sourceSheetId,
//     sheet.properties.title
//   );
//   // // Rename sheets
//   var newSheetName = format(
//     addMonths(new Date(`${sheet.properties.title}-01`), 1),
//     'yyyy-MM'
//   );
//   await _renameSheet(spreadsheetId, sourceSheetId, newSheetName);
//   await _renameSheet(
//     spreadsheetId,
//     duplicateSheet.properties.sheetId,
//     sheet.properties.title
//   );
//   duplicateSheet.properties.title = sheet.properties.title;
//   sheet.properties.title = newSheetName;

//   // // Add Protection for duplicateSheet
//   await _addProtectedRange(
//     spreadsheetId,
//     duplicateSheet.properties.sheetId,
//     ownerEmail
//   );

//   // Init sheet data
//   let sheetData = await _getSheetData(spreadsheetId, sheet);
//   await _processSheetData(
//     spreadsheetId,
//     sheet,
//     sheetData,
//     _.orderBy(updateInfo, ['index'])
//   );
//   return [
//     { sheetId: sourceSheetId, title: newSheetName },
//     {
//       sheetId: duplicateSheet.properties.sheetId,
//       title: sheet.properties.title,
//     },
//   ];
// };

// const  _duplicateSheet = async (spreadsheetId, sourceSheetId, sourceSheetTitle) => {
//   const request = {
//     spreadsheetId: spreadsheetId,
//     resource: {
//       requests: [
//         {
//           duplicateSheet: {
//             sourceSheetId: sourceSheetId,
//             insertSheetIndex: 1,
//             newSheetId: undefined,
//             newSheetName: `Copy of ${sourceSheetTitle}`,
//           },
//         },
//       ],
//     },
//   };
//   const res = await sheets.spreadsheets.batchUpdate(request);
//   return res.data.replies[0];
// };

// const  _renameSheet = async (spreadsheetId, sheetId, newSheetTitle) => {
//   const request = {
//     spreadsheetId: spreadsheetId,
//     resource: {
//       requests: [
//         {
//           updateSheetProperties: {
//             properties: {
//               sheetId: sheetId,
//               title: newSheetTitle,
//             },
//             fields: 'title',
//           },
//         },
//       ],
//     },
//   };
//   await sheets.spreadsheets.batchUpdate(request);
// };

// const  _addProtectedRange = async (spreadsheetId, sheetId, ownerEmail) => {
//   const request = {
//     spreadsheetId: spreadsheetId,
//     resource: {
//       requests: [
//         {
//           addProtectedRange: {
//             protectedRange: {
//               range: { sheetId: sheetId },
//               requestingUserCanEdit: true,
//               editors: { users: [ownerEmail] },
//             },
//           },
//         },
//       ],
//     },
//   };
//   await sheets.spreadsheets.batchUpdate(request);
// };

// const   _processSheetData = async (
//   spreadsheetId,
//   sheetInfo,
//   sheetData,
//   updateInfo
// ) => {
//   asyncForEach(updateInfo, async (info) => {
//     if (info.method === 'COPY') {
//       let data = sheetData.values[info.source];
//       await _updateSheetData(
//         spreadsheetId,
//         sheetInfo,
//         info.destination,
//         data
//       );
//     } else if (info.method === 'SET_VALUE') {
//       let { rowCount } = sheetInfo.properties.gridProperties;
//       let data = Array(rowCount - 1).fill(info.value);
//       await _updateSheetData(
//         spreadsheetId,
//         sheetInfo,
//         info.destination,
//         data
//       );
//     } else if (info.method === 'SET_VALUE_RANGE') {
//       let { rowCount } = sheetInfo.properties.gridProperties;
//       let data1 = Array(rowCount - 1);
//       let data2 = Array(rowCount - 1);
//       for (var i = 0; i < rowCount - 1; i++) {
//         try {
//           // ignore columns, if start with "*"
//           if (sheetData.values[info.source[0]][i].startsWith('*')) {
//             data1[i] = sheetData.values[info.source[0]][i];
//             data2[i] = sheetData.values[info.source[1]][i];
//           } else {
//             data1[i] = info.value[0];
//             data2[i] = info.value[1];
//           }
//         } catch (e) {
//           data1[i] = info.value[0];
//           data2[i] = info.value[1];
//         }
//       }

//       // update Text
//       await _updateSheetData(
//         spreadsheetId,
//         sheetInfo,
//         info.destination[0],
//         data1
//       );
//       // update Value
//       await _updateSheetData(
//         spreadsheetId,
//         sheetInfo,
//         info.destination[1],
//         data2
//       );
//     }
//   });
// };

// const  _updateSheetData = async (spreadsheetId, sheetInfo, column, data) => {
//   let { title } = sheetInfo.properties;
//   let { rowCount } = sheetInfo.properties.gridProperties;
//   const request = {
//     spreadsheetId: spreadsheetId,
//     range: `'${title}'!${column}2:${column}${rowCount}`,
//     valueInputOption: 'USER_ENTERED',
//     resource: {
//       range: `'${title}'!${column}2:${column}${rowCount}`,
//       majorDimension: 'COLUMNS',
//       values: [data],
//     },
//   };
//   let res = await sheets.spreadsheets.values.update(request);
// };

// const   _getSheetData = async (spreadsheetId, sheetInfo) => {
//   const request = {
//     spreadsheetId: spreadsheetId,
//     range: `'${sheetInfo.properties.title}'!A2:AD${sheetInfo.properties.gridProperties.rowCount}`,
//     majorDimension: 'COLUMNS',
//     valueRenderOption: 'UNFORMATTED_VALUE',
//     dateTimeRenderOption: 'SERIAL_NUMBER',
//   };
//   let res = await sheets.spreadsheets.values.get(request);
//   return res.data;
// };

const getSheetDataForReport = async (
  spreadsheetId: string,
  sheetId: number
) => {
  const spreadsheet = await getSpreadSheet(spreadsheetId);
  if (spreadsheet.sheets) {
    var sheetInfo = spreadsheet.sheets.find((sheet) => {
      return sheet.properties && sheet.properties.sheetId === sheetId;
    });

    if (
      sheetInfo &&
      sheetInfo.properties &&
      sheetInfo.properties.gridProperties
    ) {
      const request = {
        spreadsheetId: spreadsheetId,
        range: `'${sheetInfo.properties.title}'!A1:AD${sheetInfo.properties.gridProperties.rowCount}`,
        majorDimension: 'ROWS',
        valueRenderOption: 'UNFORMATTED_VALUE',
        dateTimeRenderOption: 'SERIAL_NUMBER',
      };
      const res = await sheets.spreadsheets.values.get(request);
      return { sheet: sheetInfo.properties, values: res.data.values };
    }
  }
  return null;
};
