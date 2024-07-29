'use server';

import { verifyCurrentUser } from '@/lib/auth/verify';
import { getFileExtension, getFilePath, withoutTrailingSlash } from '@/lib/utils';
import { User } from '@prisma/client';
import { copyFolderNoAuth, copyObjectNoAuth } from './copy';
import { deleteFileNoAuth, deleteFolderNoAuth } from './delete';

export const renameFileNoAuth = async (
   path: string,
   newName: string,
): Promise<{ error?: string; success?: string }> => {
   if (getFileExtension(newName) !== getFileExtension(path)) {
      return {
         error:
            'The extension of the file should be the same as the extension of the previous file (' +
            getFileExtension(path) +
            ' in this case)',
      };
   }

   const newPath = getFilePath(path) + newName;

   const copyResult = await copyObjectNoAuth(path, newPath);
   if (copyResult.error) return copyResult;

   const deleteResult = await deleteFileNoAuth(path);
   if (deleteResult.error) return deleteResult;

   return { success: 'The file was renamed successfully!' };
};

export const renameFile = async (
   path: string,
   newName: string,
): Promise<{ error?: string; success?: string }> => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   return renameFileNoAuth(path, newName);
};

export const renameFolder = async (
   path: string,
   newName: string,
): Promise<{ error?: string; success?: string }> => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   const newPath = getFilePath(withoutTrailingSlash(path)) + newName + '/';

   if (newPath == path) return { success: 'The folder was renamed successfully' };

   const copyResult = await copyFolderNoAuth(path, newPath);
   if (copyResult.error) return copyResult;

   const deleteResult = await deleteFolderNoAuth(path);
   if (deleteResult.error) return deleteResult;

   return { success: 'The folder was renamed successfully' };
};
