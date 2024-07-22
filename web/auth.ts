import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import db from "./lib/db";
import { getUserById } from "./data/user";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { UserRole } from "@prisma/client";
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
   interface JWT {
      role?: UserRole;
   }
}
declare module "next-auth" {
   interface Session {
      user: {
         role: UserRole;
      } & DefaultSession["user"];
   }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
   pages: {
      signIn: "/auth/login",
      error: "/auth/error",
   },
   events: {
      async linkAccount({ user }) {
         await db.user.update({
            where: { id: user.id },
            data: {
               emailVerified: new Date(),
            },
         });
      },
   },
   callbacks: {
      async signIn({ user, account }) {
         if (account?.provider !== "credentials") return true;

         if (!user.id) return false;
         const existingUser = await getUserById(user.id);

         if (!existingUser?.emailVerified) return false;

         if (existingUser.isTwoFactorEnabled) {
            const twoFactorConfirmation =
               await getTwoFactorConfirmationByUserId(existingUser.id);
               
            if (!twoFactorConfirmation) return false;

            // Delete the token for auth again in the next signin
            await db.twoFactorConfirmation.delete({
               where: { id: twoFactorConfirmation.id },
            });
         }

         return true;
      },
      async session({ token, session }) {
         if (token.sub && session.user) {
            session.user.id = token.sub;
         }

         if (token.role && session.user) {
            session.user.role = token.role;
         }

         return session;
      },
      async jwt({ token }) {
         if (!token.sub) return token;
         const existingUser = await getUserById(token.sub);
         if (!existingUser) return token;

         token.role = existingUser.role;
         return token;
      },
   },
   adapter: PrismaAdapter(db),
   session: { strategy: "jwt" },
   ...authConfig,
});
