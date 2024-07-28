'use server';

import { verifyCurrentUser } from '@/lib/auth/verify';
import { User } from '@prisma/client';
import { listContentNoAuth } from './list';
import s3Zip from 's3-zip';
import fs from 'fs';
import { join } from 'path';
import { sleep } from '@/lib/utils';
import { uploadFile } from './create';

export const createZip = async (path: string): Promise<{ error?: string; success?: string }> => {
   let user: User;
   const verification = await verifyCurrentUser();
   if (!verification.success) return { error: verification.error };
   else if (verification.data) user = verification.data;
   else
      return {
         error: 'Something unexpected happened! Please report it <a href="https://github.com/ArjunVarshney/ToolBox-Pro/issues">here</a>',
      };

   const contents = await listContentNoAuth(path);
   const fileNames = contents.map((content) => content.path.replace(path, ''));
   const folderName = path.split('/').slice(-2, -1)[0];
   const s3Destination = path.substring(0, path.length - folderName.length - 2);
   const zipName = folderName + '-' + user.id + '-' + new Date().getTime() + '.zip';
   const zipDestination = join('/app/zip-data', zipName);

   const output = fs.createWriteStream(zipDestination);

   try {
      s3Zip
         .archive(
            { s3: s3Client, bucket: 'data', preserveFolderStructure: true },
            path,
            fileNames.filter((fileName) => !fileName.endsWith('/')),
         )
         .pipe(output);
   } catch (error) {
      return { error: 'Something went wrong!' };
   }

   while (!fs.existsSync(zipDestination)) await sleep(2 * 1000);

   const formData = new FormData();
   formData.append('file', new Blob([fs.readFileSync(zipDestination)]), zipName);

   fs.unlinkSync(zipDestination);

   return await uploadFile(formData, s3Destination);
};
