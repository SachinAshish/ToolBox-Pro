'use server';
import { RegisterSchema } from '@/schemas/auth';
import * as z from 'zod';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { getUserByEmail } from '@/data/auth/user';
import { generateVerificationToken } from '@/lib/auth/tokens';
import { sendVerificationEmail } from '@/lib/auth/mail';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
   const validatedFields = RegisterSchema.safeParse(values);

   if (!validatedFields.success) {
      return { error: 'Invalid fields' };
   }

   const { name, email, password } = validatedFields.data;
   const hashedPassword = await bcrypt.hash(password, 10);

   const existingUser = await getUserByEmail(email);

   if (existingUser) return { error: 'Email already exists' };

   await db.user.create({
      data: {
         name,
         email,
         password: hashedPassword,
      },
   });

   const verificationToken = await generateVerificationToken(email);
   await sendVerificationEmail(verificationToken.email, verificationToken.token);

   return { success: 'Confirmation email sent!' };
};
