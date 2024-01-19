import { Role } from "@prisma/client";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    if (
      req.nextUrl.pathname === "/approve" &&
      req.nextauth.token?.role === Role.INTERVIEWER
    ) {
      return NextResponse.rewrite(new URL("/denied?code=3", req.url));
    }

    if (
      req.nextUrl.pathname === "/list" &&
      req.nextauth.token?.role !== Role.SUBJECT
    ) {
      return NextResponse.rewrite(new URL("/denied?code=3", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/approve", "/list"],
};
