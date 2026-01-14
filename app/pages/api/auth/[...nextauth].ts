import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import keys from "config/keys";
import { db } from "lib/firebaseUtil";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: keys.GOOGLE_ID,
      clientSecret: keys.GOOGLE_SECRET,
    }),
  ],
  adapter: FirestoreAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: keys.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
