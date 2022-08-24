import { ConfigType } from 'types';
import { ServiceAccount } from 'types/auth';

const keys: ConfigType = Object.freeze({
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/admin',
  dbName: process.env.DB_NAME || 'dbname',
  tokenSecret: process.env.JWT_SECRET || 'JWT_SECRET',
  tokenExpiresIn: process.env.JWT_EXPIRE || '7d',
  googleRedirectUri:
    process.env.GOOGLE_REDIRECT_URI ||
    'http://localhost:3000/auth/spreadsheet/callback',

  GOOGLE_ID: process.env.GOOGLE_ID || '',
  GOOGLE_SECRET: process.env.GOOGLE_SECRET || '',
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || '',
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || '',
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || '',
  FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL || '',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || '',
  FIREBASE_MESSEAGING_ID: process.env.FIREBASE_MESSEAGING_ID || '',
  FIREBASE_SERVICE_ACCOUNT_KEY: process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? (JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) as ServiceAccount)
    : undefined,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
  BASE_URL: process.env.BASE_URL || '',
  PUBLIC_PATHS: ['/auth/signin', '/unauthorized'],
});

export default keys;
