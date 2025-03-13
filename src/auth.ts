import NextAuth from 'next-auth';
import Nodemailer from 'next-auth/providers/nodemailer';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/db';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise, {
    collections: {
      Accounts: 'nextauth_accounts',
    },
  }),
  providers: [
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signOut',
    verifyRequest: '/auth/verifyRequest',
  },
  callbacks: {
    async signIn() {
      // console.log('signIn', {user, account, profile, email, credentials})
      return true;
    },
    async redirect({ baseUrl }) {
      // console.log('redirect', {url, baseUrl})
      return baseUrl;
    },
    async session({ session, token }) {
      // console.log('session', { session, user, token });
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token }) {
      // console.log('jwt', { token, user, account, profile, isNewUser });
        // if (user) {
        //   token.id = user.id;
        // }
      return token;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
  },
});
