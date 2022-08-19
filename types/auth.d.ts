import { ClientSafeProvider } from 'next-auth/react';
import { Session } from 'next-auth';

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
