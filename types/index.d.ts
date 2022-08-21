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
  mongoURI: string;
  dbName: string;
  tokenSecret: string;
  tokenExpiresIn: string;
  googleRedirectUri: string;

  GOOGLE_ID: string;
  GOOGLE_SECRET: string;
  FIREBASE_API_KEY: string;
  FIREBASE_APP_ID: string;
  FIREBASE_AUTH_DOMAIN: string;
  FIREBASE_DATABASE_URL: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_MESSEAGING_ID: string;
  FIREBASE_SERVICE_ACCOUNT_KEY: IServiceAccount;

  BASE_URL: string;
  NEXTAUTH_SECRET: string;
  PUBLIC_PATHS: string[];
};
