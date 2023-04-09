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
  TURNSTILE_SECRET: string;

  GOOGLE_ID: string;
  GOOGLE_SECRET: string;
  GOOGLE_REDIRECT_URI: string;
  FIREBASE_SERVICE_ACCOUNT_KEY: IServiceAccount;

  BASE_URL: string;
  NEXTAUTH_SECRET: string;
};

type ConstantType = {
  PUBLIC_PATHS: string[];
  TURNSTILE_PUBLIC_KEY: string;
};
