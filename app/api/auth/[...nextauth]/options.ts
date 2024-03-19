import prisma from "@/prisma/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { signJwtAccessToken } from "@/lib/jwt";

export const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "รหัสผู้ใช้",
          type: "username",
          placeholder: "รหัสผู้ใช้",
        },
        password: {
          label: "รหัสผ่าน",
          type: "password",
          placeholder: "รหัสผ่าน",
        },
      },
      async authorize(credentials) {
        if (credentials) {
          try {
            const foundUser = await prisma.user.findUnique({
              where: {
                username: credentials.username,
              },
            });
            if (
              foundUser &&
              (await bcrypt.compare(credentials.password, foundUser.password))
            ) {
              const accessToken = signJwtAccessToken(foundUser);
              const result: any = { ...foundUser, accessToken };
              delete result.password;
              return result;
            }
          } catch (error) {
            throw error;
          }
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/signIn",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User }): Promise<JWT> {
      return { ...token, ...user };
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      session.user = token as any;
      return session;
    },
  },
  session: {
    jwt: true,
    maxAge: 7 * 24 * 60 * 60,
  },
};
