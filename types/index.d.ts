interface Props {
  children: React.ReactNode;
}

type ContextProps = {
  children?: React.ReactNode;
};

interface IConfig {
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

interface IAppAction {
  type: string;
  payload: any;
}

type AlertColor = 'success' | 'info' | 'warning' | 'error';
