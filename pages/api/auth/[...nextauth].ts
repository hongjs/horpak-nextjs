import type { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import { unstable_getServerSession } from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';
import { FirestoreAdapter } from '@next-auth/firebase-adapter';
import keys from 'config/keys';

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: keys.GOOGLE_ID,
      clientSecret: keys.GOOGLE_SECRET,
    }),
  ],
  adapter: FirestoreAdapter({
    apiKey: keys.FIREBASE_API_KEY,
    authDomain: keys.FIREBASE_AUTH_DOMAIN,
    projectId: keys.FIREBASE_PROJECT_ID,
    storageBucket: keys.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: keys.FIREBASE_MESSEAGING_ID,
    appId: keys.FIREBASE_APP_ID,
  }),
};

export default NextAuth(authOptions);

export const validSession = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    throw 'Unauthorized';
  }
  return !!session;
};
