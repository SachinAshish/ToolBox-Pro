'use server';

import { verifyCurrentUser } from '@/lib/auth/verify';
import { listContentNoAuth } from './list';
import { User } from '@prisma/client';

export const searchObjects = async (key: string) => {
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
      const contents = listContentNoAuth(initial_path);

      let searchResults = [];
      if (key.includes('/'))
         searchResults = (await contents).filter(({ path }) => {
            if (path.toLowerCase().includes(key.toLowerCase())) return true;
            return false;
         });
      else
         searchResults = (await contents).filter(({ name }) => {
            if (name.toLowerCase().includes(key.toLowerCase())) return true;
            return false;
         });

      searchResults = searchResults.map((res) => ({
         ...res,
         path: res.path.replace(user.id + '/drive', 'Files'),
      }));

      return { success: true, data: searchResults || [] };
   } catch (error) {
      console.log('Search objects', error);
      return { error: 'Cannot search files' };
   }
};
