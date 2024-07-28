'use server';

import { CopyObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '@/lib/object-db';
import { User } from '@prisma/client';
import { verifyCurrentUser } from '@/lib/auth/verify';
import { getFileExtension } from '@/lib/utils';
import { listContentNoAuth, listFilesNoAuth, listFoldersNoAuth } from './list';
import { createFolderNoAuth } from './create';

export const copyObjectNoAuth = async (
   path: string,
   destPath: string,
): Promise<{ error?: string; success?: string }> => {
   // check if the file already exists
   const files = await listFilesNoAuth(destPath);
   if (files) return { error: 'A file with this name already exists!' };

   // check if the folders exists, if not create it
   const folders = destPath.split('/');
   const foldersToCheck = folders.slice(2, -1);
   let existingFolderPath = folders.slice(0, 2).join('/') + '/';
   for (const folder of foldersToCheck) {
      existingFolderPath += folder + '/';
      await createFolderNoAuth(existingFolderPath);
   }

   const command = new CopyObjectCommand({
      CopySource: 'data/' + path,
      Bucket: 'data',
      Key: destPath,
   });

   try {
      const response = await s3Client.send(command);
      if (response['$metadata'].httpStatusCode === 200)
         return { success: 'A copy of the file was created successfully!' };
      return { error: 'A copy of the file was not created.' };
   } catch (err) {
      console.log('Copy Object No Auth', err);
      return { error: 'Something went wrong!' };
   }
};

export const copyFile = async (
   path: string,
   dest: string,
): Promise<{ error?: string; success?: string }> => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   if (getFileExtension(dest) !== getFileExtension(path)) {
      return {
         error:
            'The extension of the file should be the same as the extension of the previous file (' +
            getFileExtension(path) +
            ' in this case)',
      };
   }
   return await copyObjectNoAuth(path, dest);
};

export const copyFolder = async (
   source: string,
   dest: string,
): Promise<{ error?: string; success?: string }> => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   const existingFolders = await listFoldersNoAuth(dest);
   if (existingFolders)
      return { error: 'A folder with this name already exists on this location.' };

   const sourceContent = await listContentNoAuth(source);
   const sourceFileNames = sourceContent.map((obj) => obj.path);
   const destinationFileNames = sourceFileNames.map((name) => name.replace(source, dest));

   let f = 0;
   for (let i = 0; i < sourceFileNames.length; i++) {
      const sourceFile = sourceFileNames[i];
      const destinationFile = destinationFileNames[i];

      const res = await copyObjectNoAuth(sourceFile, destinationFile);
      if (res.error) f = 1;
   }
   return f
      ? { error: 'Something went wrong! All of the files in the have not been copied' }
      : { success: 'Folder copied successfully' };
};
