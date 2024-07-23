'use server';
import { getPasswordResetTokenByToken } from '@/data/auth/password-reset-token';
import { getUserByEmail } from '@/data/auth/user';
import { NewPasswordSchema } from '@/schemas';
import * as z from 'zod';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';

export const newPassword = async (
   values: z.infer<typeof NewPasswordSchema>,
   token?: string | null,
) => {
   if (!token) return { error: 'Missing Token' };

   const validatedFields = NewPasswordSchema.safeParse(values);
   if (!validatedFields.success) return { error: 'Invalid Fields' };

   const { password } = validatedFields.data;

   const existingToken = await getPasswordResetTokenByToken(token);
   if (!existingToken) return { error: 'Invalid Token' };

   const hasExpired = new Date(existingToken.expires) < new Date();
   if (hasExpired) return { error: 'Token Expired' };

   const existingUser = await getUserByEmail(existingToken.email);
   if (!existingUser) return { error: 'No user found!' };

   const hashedPassword = await bcrypt.hash(password, 10);

   try {
      await db.user.update({
         where: { id: existingUser.id },
         data: {
            password: hashedPassword,
         },
      });
   } catch (err) {
      return { error: 'Something went wrong!' };
   }

   await db.resetPasswordToken.delete({
      where: {
         id: existingToken.id,
      },
   });

   return { success: 'Password Updated' };
};
