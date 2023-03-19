import { Dispatch } from 'react';
import { AppState } from 'types/state';

export type Props = {
  children: React.ReactNode;
};

export type AppContextProps = {
  state: AppState;
  dispatch: Dispatch<any>;
};

export type HomePageProps = {
  session: Session | null;
};

type ConfigType = {
  NODE_ENV: string;
  MONGO_URI: string;
  DB_NAME: string;
  TOKEN_SECRET: string;
  TOKEN_EXPIRES_IN: string;

  GOOGLE_ID: string;
  GOOGLE_SECRET: string;
  GOOGLE_REDIRECT_URI: string;
  // FIREBASE_API_KEY: string;
  // FIREBASE_APP_ID: string;
  // FIREBASE_AUTH_DOMAIN: string;
  // FIREBASE_DATABASE_URL: string;
  // FIREBASE_PROJECT_ID: string;
  // FIREBASE_STORAGE_BUCKET: string;
  // FIREBASE_MESSEAGING_ID: string;
  FIREBASE_SERVICE_ACCOUNT_KEY: IServiceAccount;

  BASE_URL: string;
  NEXTAUTH_SECRET: string;
  PUBLIC_PATHS: string[];
};
