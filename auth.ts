import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.users.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password_hash) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password_hash,
        );

        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          is_admin: user.is_admin,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        // token.first_name = user.first_name;
        // token.last_name = user.last_name;
        token.is_admin = user.is_admin;
      }


      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        // session.user.first_name = token.first_name as string;
        // session.user.last_name = token.last_name as string;
        session.user.is_admin = token.is_admin as boolean;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        let dbUser = await prisma.users.findUnique({
          where: {
            email: user.email!,
          },
        });

        if (!dbUser) {
          dbUser = await prisma.users.create({
            data: {
              email: user.email!,
              first_name: user.name?.split(" ")[0] ?? "",
              last_name: user.name?.split(" ").slice(1).join(" ") ?? "",
              google_id: account.providerAccountId,
              is_admin: false,
            },
          });
        }

        return true;
      }

      return true;
    },
  },
});
