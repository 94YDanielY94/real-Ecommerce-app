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
          phone: user.phone,
          is_admin: user.is_admin ?? false,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google") {
          // Google OAuth "user.id" is the Google account ID, NOT our DB UUID.
          // Look up the real DB user so session.user.id is the Prisma UUID.
          const dbUser = await prisma.users.findUnique({
            where: { email: user.email! },
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
              phone: true,
              is_admin: true,
            },
          });

          if (dbUser) {
            token.id = dbUser.id;
            token.first_name = dbUser.first_name;
            token.last_name = dbUser.last_name;
            token.phone = dbUser.phone;
            token.is_admin = dbUser.is_admin ?? false;
          } else {
            // Fallback: keep the OAuth-provided id (shouldn't normally happen,
            // because signIn() creates the DB user before jwt() runs).
            token.id = user.id;
            token.first_name = user.first_name;
            token.last_name = user.last_name;
            token.phone = user.phone;
            token.is_admin = user.is_admin ?? false;
          }
        } else {
          // Credentials provider: authorize() already returns the DB UUID.
          token.id = user.id;
          token.first_name = user.first_name;
          token.last_name = user.last_name;
          token.phone = user.phone;
          token.is_admin = user.is_admin;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.first_name = token.first_name as string;
        session.user.last_name = token.last_name as string;
        session.user.phone = token.phone as string | undefined;
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
        } else if (!dbUser.google_id) {
          // Existing credentials account signing in with Google for the first
          // time: link the Google account to it.
          await prisma.users.update({
            where: { id: dbUser.id },
            data: { google_id: account.providerAccountId },
          });
        }

        return true;
      }

      return true;
    },
  },
});
