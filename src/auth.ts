import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { getServerSession } from 'next-auth';
import clientPromise from '@/lib/db';
import { sendVerificationRequest } from './email';

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise, {
    collections: {
      Users: 'nextauth_users',
      Sessions: 'nextauth_sessions',
      Accounts: 'nextauth_accounts',
    },
  }),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
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
  },
};

// Export NextAuth handler
export default NextAuth(authOptions);

// Export getServerSession as auth for backward compatibility
export async function auth() {
  return await getServerSession(authOptions);
}
