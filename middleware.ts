import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { Role } from "./types/dto/role";

interface AccessRole {
  path: string;
  role: Role[];
}

const accessRole: AccessRole[] = [
  {
    path: "/approve",
    role: [Role.SUPERVISOR, Role.SUBJECT],
  },
  {
    path: "/list",
    role: [Role.SUBJECT],
  },
  {
    path: "/accessControl",
    role: [Role.SUBJECT],
  },
  {
    path: "/specification",
    role: [Role.SUPERVISOR, Role.SUBJECT],
  },
];

export default withAuth(
  function middleware(req) {
    for (const item of accessRole) {
      if (req.nextUrl.pathname === item.path) {
        if (!item.role.includes(req.nextauth.token?.role as Role)) {
          return NextResponse.rewrite(new URL("/denied?code=3", req.url));
        }
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/approve", "/list", "/accessControl", "/specification"],
};
