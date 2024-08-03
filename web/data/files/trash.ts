'use server';

import { User } from '@prisma/client';
import { verifyCurrentUser } from '@/lib/auth/verify';
import { getFileExtension, getFileName, withoutTrailingSlash } from '@/lib/utils';
import { copyFolderNoAuth, copyObjectNoAuth } from './copy';
import { deleteFileNoAuth, deleteFolderNoAuth } from './delete';
import { listContentNoAuth } from './list';
import { moveFileNoAuth, moveFolderNoAuth } from './move';
import db from '@/lib/db';

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
      const dbRes = await db.trashFileAndFolder.findMany({
         where: {
            userId: user.id,
         },
      });

      const filteredContents = [];
      for (const content of contents) {
         let { path } = content;

         let dbContent = dbRes.find(({ id }) => path.includes(id));
         if (!dbContent) continue;

         path = withoutTrailingSlash(path);
         const pathArr = path.split('/');

         if (pathArr.length === 3)
            filteredContents.push({
               name: content.name.replace('-' + dbContent.id, ''),
               path: content.path,
               type: content.type,
               modified: content.modified,
               size: content.size,
               filePath: dbContent?.originalPath || user.id + '/drive/' + content.name,
               id: dbContent?.id,
            });
      }

      return {
         success: 'No error ocurred during reading',
         data: filteredContents || [],
      };
   } catch (err) {
      console.error('Error listing files', err);
      return { error: 'Error listing files!' };
   }
};

export const moveFileToTrash = async (path: string) => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   const trashPath = user.id + '/trash/';
   const fileName = getFileName(path);
   let newPath = trashPath + getFileName(path);

   try {
      const dbRes = await db.trashFileAndFolder.create({
         data: {
            userId: user.id,
            originalPath: path,
            trashPath: newPath,
         },
      });

      newPath =
         trashPath +
         fileName.substring(0, fileName.lastIndexOf('.')) +
         '-' +
         dbRes.id +
         getFileExtension(fileName);

      const copyResult = await copyObjectNoAuth(path, newPath);
      if (copyResult.error) return copyResult;

      const deleteResult = await deleteFileNoAuth(path);
      if (deleteResult.error) return deleteResult;

      return { success: 'The file is trashed successfully!' };
   } catch (error) {
      console.log('move file to trash error: ', error);
      return { error: 'Could not move the file to trash' };
   }
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
   let newPath = trashPath + getFileName(withoutTrailingSlash(path)) + '/';

   try {
      const dbRes = await db.trashFileAndFolder.create({
         data: {
            userId: user.id,
            originalPath: path,
            trashPath: newPath,
         },
      });

      newPath = trashPath + getFileName(withoutTrailingSlash(path)) + '-' + dbRes.id + '/';
      const copyResult = await copyFolderNoAuth(path, newPath);
      if (copyResult.error) return copyResult;

      const deleteResult = await deleteFolderNoAuth(path);
      if (deleteResult.error) return deleteResult;

      return { success: 'The folder was moved successfully' };
   } catch (error) {
      console.log('move file to trash error: ', error);
      return { error: 'The folder could not be moved to Trash' };
   }
};

export const deleteFileFromTrash = async (
   path: string,
): Promise<{ error?: string; success?: string }> => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   if (!path) return { error: 'File name not found' };

   const res = await deleteFileNoAuth(path);

   await db.trashFileAndFolder.delete({
      where: {
         id: path.substring(path.lastIndexOf('-') + 1, path.lastIndexOf('.')),
         userId: user.id,
      },
   });

   return res;
};

export const deleteFolderFromTrash = async (
   path: string,
): Promise<{ error?: string; success?: string }> => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   const res = await deleteFolderNoAuth(path);

   await db.trashFileAndFolder.delete({
      where: {
         id: path.substring(path.lastIndexOf('-') + 1, path.lastIndexOf('/')),
         userId: user.id,
      },
   });

   return res;
};

export const restoreFileFromTrash = async (
   trashPath: string,
   originalPath: string,
): Promise<{ error?: string; success?: string }> => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   const res = await moveFileNoAuth(trashPath, originalPath, false, true);

   await db.trashFileAndFolder.delete({
      where: {
         id: trashPath.substring(trashPath.lastIndexOf('-') + 1, trashPath.lastIndexOf('.')),
         userId: user.id,
         originalPath,
      },
   });

   return res;
};

export const restoreFolderFromTrash = async (
   trashPath: string,
   originalPath: string,
): Promise<{ error?: string; success?: string }> => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   const res = await moveFolderNoAuth(trashPath, originalPath, true);

   await db.trashFileAndFolder.delete({
      where: {
         id: trashPath.substring(trashPath.lastIndexOf('-') + 1, trashPath.lastIndexOf('/')),
         userId: user.id,
         originalPath,
      },
   });

   return res;
};

export const emptyTrash = async (): Promise<{ error?: string; success?: string }> => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   const trashData = await listTrashContent();

   if (!trashData.data) return { error: 'No file found in the trash!' };

   let res,
      f = 0;
   for (const content of trashData.data) {
      if (content.type === 'directory') {
         res = await deleteFolderNoAuth(content.path);
      } else {
         res = await deleteFileNoAuth(content.path);
      }
      if (res.error) f = 1;
   }

   await db.trashFileAndFolder.deleteMany({
      where: {
         userId: user.id,
      },
   });

   if (f === 1) return { error: 'Some file may not be deleted from trash' };
   return { success: 'All files were permanently deleted from trash' };
};
