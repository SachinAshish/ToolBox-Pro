'use server';

import { verifyCurrentUser } from '@/lib/auth/verify';
import db from '@/lib/db';
import { User } from '@prisma/client';
import { listContentNoAuth } from './list';

export const addFileToStar = async (path: string) => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   try {
      await db.starFileAndFolder.create({
         data: {
            userId: user.id,
            path,
         },
      });
      return { success: '1 file was starred' };
   } catch (error) {
      console.log('Add file to star: ', error);
      return { error: 'Something went wrong while adding the file to star list' };
   }
};

export const removeFileFromStar = async (path: string) => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   try {
      const file = await db.starFileAndFolder.findFirst({
         where: {
            userId: user.id,
            path,
         },
      });

      if (!file) return { error: 'Could not find the file!' };

      await db.starFileAndFolder.delete({ where: { id: file.id } });

      return { success: '1 file was remove from starred' };
   } catch (error) {
      console.log('Add file to star: ', error);
      return { error: 'Something went wrong while removing the file to star list' };
   }
};

export const addFolderToStar = async (path: string) => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   try {
      await db.starFileAndFolder.create({
         data: {
            userId: user.id,
            path,
         },
      });
      return { success: '1 folder was starred' };
   } catch (error) {
      console.log('Add folder to star: ', error);
      return { error: 'Something went wrong while adding the folder to star list' };
   }
};

export const removeFolderFromStar = async (path: string) => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   try {
      const file = await db.starFileAndFolder.findFirst({
         where: {
            userId: user.id,
            path,
         },
      });

      if (!file) return { error: 'Could not find the folder!' };

      await db.starFileAndFolder.delete({ where: { id: file.id } });

      return { success: '1 folder was remove from starred' };
   } catch (error) {
      console.log('Add folder to star: ', error);
      return { error: 'Something went wrong while removing the folder to star list' };
   }
};

export const listStarred = async () => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   try {
      let contents = await listContentNoAuth('');

      const starred = await db.starFileAndFolder.findMany({
         where: {
            userId: user.id,
         },
      });

      const processedContents = [];

      for (const content of contents) {
         const isStarred = starred.find(({ path }) => path === content.path);
         console.log(isStarred);
         if (!!isStarred) {
            content['starred'] = true;
            processedContents.push(content);
         }
      }

      // console.log(processedContents)

      return { success: 'No errors', data: processedContents };
   } catch (error) {
      console.log('list starred: ', error);
      return { error: 'Something went wrong while reading the starred files and folders' };
   }
};
