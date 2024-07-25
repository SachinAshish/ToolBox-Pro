'use server';

import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import s3Client from '@/lib/object-db';
import { verifyCurrentUser } from '@/lib/auth/verify';
import { User } from '@prisma/client';

export const listFilesNoAuth = async (path: string) => {
   const command = new ListObjectsV2Command({
      Bucket: 'data',
      Prefix: path.endsWith('/') ? path.slice(0, -1) : path,
   });
   const data = await s3Client.send(command);
   const fileNames = data.Contents?.filter((content: any) => !content.Key!.endsWith('/')).map(
      (content) => content.Key!,
   );
   return fileNames;
};

export const listFiles = async (path: string) => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   const initial_path = user.id + '/' + 'drive/';

   try {
      const fileNames = await listFilesNoAuth(initial_path + path);
      return {
         success: true,
         data: fileNames || [],
      };
   } catch (err) {
      console.error('Error listing files', err);
      return { error: 'Error listing files!' };
   }
};

export const listFoldersNoAuth = async (path: string) => {
   const command = new ListObjectsV2Command({
      Bucket: 'data',
      Prefix: path.endsWith('/') ? path.slice(0, -1) : path,
      Delimiter: '/',
   });
   const data = await s3Client.send(command);
   const folderNames = data.CommonPrefixes?.map((prefix) => prefix.Prefix!);
   return folderNames;
};

export const listFolders = async (path: string) => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   const initial_path = user.id + '/' + 'drive/';

   try {
      const folderNames = await listFoldersNoAuth(initial_path + path);
      return {
         success: true,
         data: folderNames || [],
      };
   } catch (err) {
      console.error('Error listing folders', err);
      return { error: 'Error listing folders!' };
   }
};

export const listContentNoAuth = async (path: string) => {
   const command = new ListObjectsV2Command({
      Bucket: 'data',
      Prefix: path.endsWith('/') ? path.slice(0, -1) : path,
   });

   const data = await s3Client.send(command);
   const contents = data.Contents?.map((content) => content.Key!.replaceAll('//', '/'));
   return contents;
};

export const listContent = async (path: string) => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   const initial_path = user.id + '/' + 'drive/';

   try {
      const contents = await listContentNoAuth(initial_path + path);
      return {
         data: contents || [],
      };
   } catch (err) {
      console.error('Error listing files', err);
      return { error: 'Error listing files!' };
   }
};
