import { ConfigType } from 'types';
import { ServiceAccount } from 'types/auth';

const keys: ConfigType = Object.freeze({
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/admin',
  DB_NAME: process.env.DB_NAME || 'dbname',
  TOKEN_SECRET: process.env.JWT_SECRET || 'JWT_SECRET',
  TOKEN_EXPIRES_IN: process.env.JWT_EXPIRE || '7d',
  GOOGLE_ID: process.env.GOOGLE_ID || '',
  GOOGLE_SECRET: process.env.GOOGLE_SECRET || '',
  GOOGLE_REDIRECT_URI:
    process.env.GOOGLE_REDIRECT_URI ||
    'http://localhost:3000/auth/spreadsheet/callback',
  FIREBASE_SERVICE_ACCOUNT_KEY: process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? (JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) as ServiceAccount)
    : undefined,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
  BASE_URL: process.env.BASE_URL || '',
  PUBLIC_PATHS: [
    '/auth/signin',
    '/unauthorized',
    '/privacyPolicy',
    '/termOfService',
  ],
});

export default keys;
