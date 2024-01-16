import { Role } from "@prisma/client";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    if (
      req.nextUrl.pathname === "/list" &&
      req.nextauth.token?.role !== Role.SUPERVISOR
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
  matcher: ["/list"],
};
