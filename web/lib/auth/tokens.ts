import { getVerificationTokenByEmail } from '@/data/auth/verification-token';
import { v4 as uuid } from 'uuid';
import db from '@/lib/db';
import { getPasswordResetTokenByEmail } from '@/data/auth/password-reset-token';
import crypto from 'crypto';
import { getTwoFactorTokenByEmail } from '@/data/auth/two-factor-token';

export const generateVerificationToken = async (email: string) => {
   const token = uuid();
   const expires = new Date(new Date().getTime() + 15 * 60 * 1000);

   const existingToken = await getVerificationTokenByEmail(email);

   if (existingToken) {
      await db.verificationToken.delete({
         where: {
            id: existingToken.id,
         },
      });
   }

   const verificationToken = await db.verificationToken.create({
      data: {
         email,
         token,
         expires,
      },
   });

   return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
   const token = uuid();
   const expires = new Date(new Date().getTime() + 15 * 60 * 1000);

   const existingToken = await getPasswordResetTokenByEmail(email);

   if (existingToken) {
      await db.resetPasswordToken.delete({
         where: {
            id: existingToken.id,
         },
      });
   }

   const passwordToken = await db.resetPasswordToken.create({
      data: {
         email,
         token,
         expires,
      },
   });

   return passwordToken;
};

export const generateTwoFactorToken = async (email: string) => {
   const token = crypto.randomInt(1_00_000, 10_00_000).toString();
   const expires = new Date(new Date().getTime() + 15 * 60 * 1000);

   const existingToken = await getTwoFactorTokenByEmail(email);
   if (existingToken) {
      await db.twoFactorToken.delete({ where: { id: existingToken.id } });
   }

   const twoFactorToken = await db.twoFactorToken.create({
      data: {
         email,
         token,
         expires,
      },
   });

   return twoFactorToken;
};
