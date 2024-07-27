import { getUserById } from '@/data/auth/user';
import { currentUser } from './auth';
import { User } from '@prisma/client';

export const verifyCurrentUser = async (): Promise<{
   error?: string;
   success?: true;
   data?: User;
}> => {
   const user = await currentUser();
   if (!user || !user.id) return { error: 'Not Authenticated!' };

   const existingUser = await getUserById(user.id);
   if (!existingUser) return { error: 'User not found!' };

   if (!existingUser.emailVerified)
      return { error: 'Verify Your email before making any changes.' };

   return { success: true, data: existingUser };
};
