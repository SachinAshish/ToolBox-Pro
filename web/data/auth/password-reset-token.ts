import db from '@/lib/db';

export const getPasswordResetTokenByToken = async (token: string) => {
   try {
      const passwordToken = await db.resetPasswordToken.findFirst({
         where: { token },
      });

      return passwordToken;
   } catch (error) {
      return null;
   }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
   try {
      const passwordToken = await db.resetPasswordToken.findFirst({
         where: { email },
      });

      return passwordToken;
   } catch (error) {
      return null;
   }
};
