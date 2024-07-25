'use server';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '@/lib/object-db';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import axios from 'axios';
import { listFilesNoAuth, listFoldersNoAuth } from './list';
import { verifyCurrentUser } from '@/lib/auth/verify';
import { User } from '@prisma/client';

export const createFolder = async (path: string) => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   const initial_path = user.id + '/' + 'drive/';

   const folders = await listFoldersNoAuth(initial_path + path);
   const existingFolder = folders?.filter(
      (folder) => folder.substring(initial_path.length) === path,
   )[0];
   if (existingFolder) return { error: 'A folder with this name already exists!' };

   const command = new PutObjectCommand({
      Bucket: 'data',
      Key: initial_path + path + '/',
      ContentType: 'text/directory',
   });
   try {
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      const result = await axios.put(url, '', {
         headers: {
            'Content-Type': 'application/octet-stream',
         },
      });
      if (result.status === 200) return { success: `${path} has been created.` };
      return { error: `The folder ${path} could not be created.` };
   } catch (error) {
      console.log(error);
      return { error: 'Something went wrong!' };
   }
};

export const uploadFile = async (formData: FormData) => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   const initial_path = user.id + '/' + 'drive/';

   const file = formData.get('file') as File;

   const files = await listFilesNoAuth(initial_path);
   const existingFile = files?.filter((f) => f.endsWith(file.name))[0];
   if (existingFile) return { error: 'A file with this name already exists!' };

   const command = new PutObjectCommand({
      Bucket: 'data',
      Key: initial_path + file.name,
      ContentType: file.type,
   });
   try {
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      const result = await axios.put(url, formData, {
         headers: { 'Content-Type': file.type },
      });
      if (result.status === 200) return { success: `${file.name} has been uploaded.` };
      return { error: 'The file could not be uploaded.' };
   } catch (error) {
      console.log(error);
      return { error: 'Something went wrong!' };
   }
};
