'use server';

import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Client from '@/lib/object-db';
import axios from 'axios';
import { verifyCurrentUser } from '@/lib/auth/verify';
import { listContentNoAuth } from './list';
import { User } from '@prisma/client';

const getSignedUrlForDelete = async (key: string) => {
   const command = new DeleteObjectCommand({
      Bucket: 'data',
      Key: key,
   });

   try {
      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      return signedUrl;
   } catch (err) {
      console.error('Error generating delete signed URL', err);
   }
};

export const deleteFileNoAuth = async (key: string) => {
   console.log(key);
   const signedUrl = await getSignedUrlForDelete(key);
   if (!signedUrl)
      return { error: 'Not able to generate a safe environment for deleting the file!' };

   try {
      await axios.delete(signedUrl);
      return { success: 'File deleted successfully!' };
   } catch (err) {
      console.error('Error deleting object', err);
      return { error: 'Error deleting file! Try again after some time.' };
   }
};

export const deleteFile = async (key: string) => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   return await deleteFileNoAuth(key);
};

export const deleteFolder = async (folderPath: string) => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   try {
      const contents = await listContentNoAuth(folderPath);

      if (!contents) return { error: 'No such folder exists!' };

      let error: string[] = [];
      for (let content of contents) {
         if (content.endsWith('/')) content += '/';
         const result = await deleteFileNoAuth(content);
         if (result.error) error.push(content.substring(folderPath.length) + ': ' + result.error);
      }
      if (error.length) return { error: error.join('<br/>') };
      return { success: '1 folder deleted' };
   } catch (err) {
      console.error('Error deleting folder', err);
   }
};
