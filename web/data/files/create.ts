'use server';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '@/lib/object-db';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import axios from 'axios';
import { listFilesNoAuth, listFoldersNoAuth } from './list';
import { verifyCurrentUser } from '@/lib/auth/verify';
import { User } from '@prisma/client';
import mime from 'mime-types';
import { withTrailingSlash } from '@/lib/utils';

export const createFolderNoAuth = async (
   path: string,
): Promise<{
   success?: string;
   error?: string;
}> => {
   const folders = await listFoldersNoAuth(path);
   if (folders?.length) return { error: 'A folder with this name already exists!' };

   const command = new PutObjectCommand({
      Bucket: 'data',
      Key: withTrailingSlash(path),
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
      console.log('createFolderNoAuth ', error);
      return { error: 'Something went wrong!' };
   }
};

export const createFolder = async (path: string) => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   const initial_path = user.id + '/drive';
   const complete_path = path.startsWith(initial_path) ? path : initial_path + path;

   return await createFolderNoAuth(complete_path);
};

export const uploadFile = async (formData: FormData, path: string) => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   let initial_path = user.id + '/drive';

   if (path.startsWith(initial_path)) initial_path = path + '/';
   else initial_path = initial_path + '/' + path + '/';
   initial_path = initial_path.replaceAll('//', '/');

   const file = formData.get('file') as File;
   if (!mime.lookup(file.name)) return { error: 'File type not recognized!' };

   const binaryFile = await file.arrayBuffer();
   const fileBuffer = Buffer.from(binaryFile);

   const files = await listFilesNoAuth(initial_path + file.name);
   if (files) return { error: 'A file with this name already exists!' };

   const command = new PutObjectCommand({
      Bucket: 'data',
      Key: initial_path + file.name,
      ContentType: file.type,
   });
   try {
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      const result = await axios.put(url, fileBuffer, {
         headers: { 'Content-Type': 'multipart/form-data' },
         responseType: 'arraybuffer',
      });
      if (result.status === 200) return { success: `${file.name} has been uploaded.` };
      return { error: 'The file could not be uploaded.' };
   } catch (error) {
      console.log(error);
      return { error: 'Something went wrong!' };
   }
};
