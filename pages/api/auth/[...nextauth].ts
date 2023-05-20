import NextAuth, {AuthOptions, User} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import db from "@/lib/db";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXT_PUBLIC_SECRET,
  pages: {
    newUser: "/onboarding",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    session: async ({session, user}: any): Promise<any> => {
      session.user.id = user.id;
      return session;
    },
  },
  events: {
    createUser: async (user: {user: User}): Promise<void> => {
      let username;

      const userExists: User | null = await db.user.findUnique({
        where: {
          username: user.user.name?.replace(/\s/g, "").toLowerCase(),
        },
      });

      if (userExists) {
        username = `${user.user.name
          ?.replace(/\s/g, "")
          .toLowerCase()}_${window.crypto
          .getRandomValues(new Uint32Array(4))[0]
          .toString(36)
          .substring(7)}`;
      } else {
        username = user.user.name?.replace(/\s/g, "").toLowerCase();
      }

      await db.user.update({
        where: {
          id: user.user.id,
        },
        data: {
          username: username,
        },
      });
    },
  },
};

export default NextAuth(authOptions);
