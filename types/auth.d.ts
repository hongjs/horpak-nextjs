import { ClientSafeProvider } from 'next-auth/react';
import { Session } from 'next-auth';

export type ServiceAccount = {
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

type IUser = {
  id: string;
  name: string;
  email: string;
  image: string;
  emailVerified?: boolean;
  active?: boolean;
  admin?: boolean;
};

interface IAppReducerState {
  users: IUser[];
  number: number;
}

export type HomePageProps = {
  session: Session | null;
};

export type SignInProps = {
  providers: ClientSafeProvider[];
};
