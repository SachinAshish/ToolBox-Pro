'use server';

import { moveFileNoAuth, moveFolderNoAuth } from './move';
import { User } from '@prisma/client';
import { verifyCurrentUser } from '@/lib/auth/verify';
import { getFileExtension, getFileName, getFilePath, withoutTrailingSlash } from '@/lib/utils';
import { copyFolderNoAuth, copyObjectNoAuth } from './copy';
import { deleteFileNoAuth, deleteFolderNoAuth } from './delete';

const slashReplace = '{{:splash:}}';

export const moveFileToTrash = async (path: string) => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   const fileName = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
   const trashPath = user.id + '/trash/';
   let newPath =
      trashPath +
      (
         fileName +
         '-trash-' +
         '{filePath:"' +
         getFilePath(path) +
         '",time:' +
         new Date().getTime() +
         '}'
      ).replaceAll('/', slashReplace) +
      getFileExtension(path);

   const copyResult = await copyObjectNoAuth(path, newPath);
   if (copyResult.error) return copyResult;

   const deleteResult = await deleteFileNoAuth(path);
   if (deleteResult.error) return deleteResult;

   return { success: 'The file is trashed successfully!' };
};

export const moveFolderToTrash = async (path: string) => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   const trashPath = user.id + '/trash/';
   let newPath =
      trashPath +
      (
         getFileName(withoutTrailingSlash(path)) +
         '-trash-' +
         '{filePath:"' +
         getFilePath(withoutTrailingSlash(path)) +
         '",time:' +
         new Date().getTime() +
         '}'
      ).replaceAll('/', slashReplace) +
      '/';

   if (newPath == path) return { success: 'The folder was moved successfully' };

   const copyResult = await copyFolderNoAuth(path, newPath);
   if (copyResult.error) return copyResult;

   const deleteResult = await deleteFolderNoAuth(path);
   if (deleteResult.error) return deleteResult;

   return { success: 'The folder was moved successfully' };
};
