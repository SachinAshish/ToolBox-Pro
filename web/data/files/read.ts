'use server';

import { verifyCurrentUser } from '@/lib/auth/verify';
import s3Client from '@/lib/object-db';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { User } from '@prisma/client';

export const getFileUrlNoAuth = async (key: string) => {
   const command = new GetObjectCommand({
      Bucket: 'data',
      Key: key,
   });

   try {
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      return url;
   } catch (error) {
      console.log('getFileUrlNoAuth Error', error);
      throw error;
   }
};

export const getFileUrl = async (path: string) => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };
   try {
      const url = await getFileUrlNoAuth(path);
      if (!url) return { error: 'Could not generate a secure link for the file.' };
      return { success: 'File link generated Successfull!', url };
   } catch (error) {
      console.log('GetFileUrl Error', error);
      return { error: 'Something went wrong!' };
   }
};
