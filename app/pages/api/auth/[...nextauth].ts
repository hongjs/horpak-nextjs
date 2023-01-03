import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { FirestoreAdapter } from '@next-auth/firebase-adapter';
import keys from 'config/keys';

export const authOptions: NextAuthOptions = {
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
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: keys.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
