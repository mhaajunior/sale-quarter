import { Role } from "@/types/dto/role";
import NextAuth, { Account, DefaultSession, User } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: IUser;
  }
}

interface IUser {
  id: number;
  username: string;
  role: Role;
  fullname: string;
  province: number;
  accessToken: string;
}
