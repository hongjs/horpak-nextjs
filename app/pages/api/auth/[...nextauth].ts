import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { FirestoreAdapter } from '@next-auth/firebase-adapter';
import { cert } from 'firebase-admin/app';
import keys from 'config/keys';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: keys.GOOGLE_ID,
      clientSecret: keys.GOOGLE_SECRET,
    }),
  ],
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: keys.FIREBASE_SERVICE_ACCOUNT_KEY.project_id,
      clientEmail: keys.FIREBASE_SERVICE_ACCOUNT_KEY.client_email,
      privateKey: keys.FIREBASE_SERVICE_ACCOUNT_KEY.private_key,
    }),
  }),
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: keys.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
