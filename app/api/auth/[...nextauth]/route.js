import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDb } from '@utils/database';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  async session({ session }) {},
  async signIn({ profile }) {
    try {
      //serverless -> lamda -> dynamodb
      await connectToDb();
      //check if a user already exists

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
});

export default handler;
