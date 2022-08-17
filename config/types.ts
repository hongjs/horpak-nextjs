import { ClientSafeProvider } from 'next-auth/react';
import { Session } from 'next-auth';

export type IServiceAccount = {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
};

export interface IConfig {
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
}

export type ContextProps = {
  children?: React.ReactNode;
};

export type HomePageProps = {
  session: Session | null;
};

export type SignInProps = {
  providers: ClientSafeProvider[];
};

export type IUser = {
  id: string;
  name: string;
  email: string;
  image: string;
  emailVerified?: boolean;
  active?: boolean;
  admin?: boolean;
};

export interface Props {
  children: React.ReactNode;
}

export interface IAppReducerState {
  users: IUser[];
  number: number;
}

export interface IAppAction {
  type: string;
  payload: any;
}

export type AlertColor = 'success' | 'info' | 'warning' | 'error';
