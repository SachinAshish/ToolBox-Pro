'use server';

import { getUserByEmail } from '@/data/auth/user';
import { sendPasswordResetEmail } from '@/lib/auth/mail';
import { generatePasswordResetToken } from '@/lib/auth/tokens';
import { ResetPasswordSchema } from '@/schemas';
import * as z from 'zod';

export const reset = async (values: z.infer<typeof ResetPasswordSchema>) => {
   const validatedFields = ResetPasswordSchema.safeParse(values);

   if (!validatedFields.success) return { error: 'Invalid email!' };
   const { email } = validatedFields.data;

   const existingUser = await getUserByEmail(email);
   if (!existingUser) return { error: 'Email not found!' };

   try {
      const passwordResetToken = await generatePasswordResetToken(email);
      await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);
   } catch (error) {
      console.log(error);
      return { error: 'Something went wrong!' };
   }

   return { success: 'Reset Email sent' };
};
