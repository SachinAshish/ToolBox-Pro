'use server';

import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import s3Client from '@/lib/object-db';
import { verifyCurrentUser } from '@/lib/auth/verify';
import { User } from '@prisma/client';
import mime from 'mime-types';
import { contentType } from '@/types';
import { withoutTrailingSlash } from '@/lib/utils';
import { parseTrashName } from '@/lib/files/parse-name';

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
      console.log('Error listing files', err);
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
   path = path.endsWith('/') ? path.slice(0, -1) : path;
   const command = new ListObjectsV2Command({
      Bucket: 'data',
      Prefix: path,
   });

   const data = await s3Client.send(command);
   const contents =
      data.Contents?.map((content) => ({
         key: content.Key!.replaceAll('//', '/'),
         modified: content.LastModified || new Date(),
         size: (content.Size || 0) / 1000,
      })) || [];
   const content_details: contentType[] = [];
   for (const { key: contentPath, modified, size } of contents) {
      if (contentPath === path + '/') continue;
      const isFolder = contentPath.endsWith('/');
      let details: contentType = {
         type: '',
         name: '',
         path: '',
         modified,
         size,
      };
      if (isFolder) {
         details.type = 'directory';
         details.name = contentPath.split('/').slice(-2, -1)[0];
      } else {
         details.type = mime.lookup(contentPath);
         details.name = contentPath.split('/').slice(-1)[0];
      }
      details.path = contentPath;
      content_details.push(details);
   }
   return content_details;
};

export const listContent = async (path: string, depth?: number) => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   const initial_path = user.id + '/' + 'drive/';
   const folderPath = initial_path + (path ? path + '/' : '');

   try {
      let contents = await listContentNoAuth(folderPath);
      if (depth)
         contents = contents.filter((content) => {
            let { path } = content;

            const isFolder = path.endsWith('/');
            if (isFolder) path = path.substring(0, path.length - 1);

            const pathArr = path.split('/');
            const folderPathArr = folderPath.split('/');

            if (pathArr.length === folderPathArr.length + depth - 1) return true;
            return false;
         });
      return {
         success: 'No error ocurred during reading',
         data: contents || [],
      };
   } catch (err) {
      console.error('Error listing files', err);
      return { error: 'Error listing files!' };
   }
};

export const listTrashContent = async () => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   const trash_path = user.id + '/' + 'trash';

   try {
      let contents = await listContentNoAuth(trash_path);

      contents = contents.filter((content) => {
         let { path } = content;
         path = withoutTrailingSlash(path);

         const pathArr = path.split('/');

         if (pathArr.length === 3) return true;
         return false;
      });

      contents = contents.map((content) => {
         let { name, type } = content;
         const details = parseTrashName(name, type === 'directory');
         return { ...content, ...details };
      });

      return {
         success: 'No error ocurred during reading',
         data: contents || [],
      };
   } catch (err) {
      console.error('Error listing files', err);
      return { error: 'Error listing files!' };
   }
};
