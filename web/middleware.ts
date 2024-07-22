import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import {
   apiAuthPrefix,
   authRoutes,
   DEFAULT_LOGIN_REDIRECT,
   publicRoutes,
} from "@/routes";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

// @ts-ignore
export default auth((req: { auth?: any; nextUrl?: any }) => {
   const { nextUrl } = req;
   const isLoggedIn = !!req.auth;
   const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
   const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
   const isAuthRoute = authRoutes.includes(nextUrl.pathname);

   if (isApiAuthRoute) return null;
   if (isAuthRoute) {
      if (isLoggedIn)
         return NextResponse.redirect(
            new URL(DEFAULT_LOGIN_REDIRECT, nextUrl.origin)
         );
      return null;
   }
   if (!isLoggedIn && !isPublicRoute) {
      return NextResponse.redirect(new URL("/auth/login", nextUrl.origin));
   }
   return null;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
