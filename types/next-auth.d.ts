import { Role } from "@prisma/client";
import NextAuth, { Account, DefaultSession, User } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: IUser;
  }
}

interface IUser {
  id: number;
  role: Role;
  fullname: string;
  province: string;
  accessToken: string;
}
