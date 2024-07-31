'use server';

import { verifyCurrentUser } from '@/lib/auth/verify';
import { getFileName, withoutTrailingSlash } from '@/lib/utils';
import { User } from '@prisma/client';
import { copyFolderNoAuth, copyObjectNoAuth } from './copy';
import { deleteFileNoAuth, deleteFolderNoAuth } from './delete';

export const moveFileNoAuth = async (
   path: string,
   newPath: string,
   directObject?: boolean,
   isFileNamePresent?: boolean,
): Promise<{ error?: string; success?: string }> => {
   if (!isFileNamePresent) {
      const fileName = getFileName(path);
      newPath = newPath.endsWith(fileName) ? newPath : newPath + fileName;
   }

   if (path === newPath) return { success: 'The file was moved successfully!' };

   const copyResult = await copyObjectNoAuth(path, newPath, directObject);
   if (copyResult.error) return copyResult;

   const deleteResult = await deleteFileNoAuth(path);
   if (deleteResult.error) return deleteResult;

   return { success: 'The file was moved successfully!' };
};

export const moveFile = async (
   path: string,
   newPath: string,
): Promise<{ error?: string; success?: string }> => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   return moveFileNoAuth(path, newPath);
};

export const moveFolderNoAuth = async (
   path: string,
   newPath: string,
   isFileNamePresent?: boolean,
): Promise<{ error?: string; success?: string }> => {
   if (!isFileNamePresent) newPath += getFileName(withoutTrailingSlash(path)) + '/';

   if (newPath == path) return { success: 'The folder was moved successfully' };

   const copyResult = await copyFolderNoAuth(path, newPath);
   if (copyResult.error) return copyResult;

   const deleteResult = await deleteFolderNoAuth(path);
   if (deleteResult.error) return deleteResult;

   return { success: 'The folder was moved successfully' };
};

export const moveFolder = async (
   path: string,
   newPath: string,
): Promise<{ error?: string; success?: string }> => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   return await moveFolderNoAuth(path, newPath);
};
