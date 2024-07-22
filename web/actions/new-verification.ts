"use server";

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import db from "@/lib/db";

export const newVerification = async (token: string) => {
   const existingToken = await getVerificationTokenByToken(token);
   if (!existingToken) return { error: "Token does not exists" };

   const hasExpired = new Date(existingToken.expires) < new Date();
   if (hasExpired) return { error: "Token has expired" };

   const existingUser = await getUserByEmail(existingToken.email);

   if (!existingUser) return { error: "User does not exists!" };

   try {
      console.log(existingToken.id);
      await db.user.update({
         where: { email: existingToken.email },
         data: {
            emailVerified: new Date(),
            email: existingToken.email,
         },
      });
   } catch (error) {
      console.log(error);
      return { error: "Something went wrong! Retry some time later." };
   }

   try {
      await db.verificationToken.delete({
         where: { id: existingToken.id },
      });
   } catch (error) {
      // nothing we can do
   }

   return { success: "Email verified" };
};
