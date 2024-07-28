import * as z from 'zod';

export const FileSchema = z.object({
   files: z
      .array(z.instanceof(File))
      .max(10, {
         message: 'Maximum 10 files are allowed!',
      })
      .refine(
         (files) => {
            const fileNames = [...files.map((file) => file.name)];
            if (fileNames.length !== new Set(fileNames).size) return false;
            return true;
         },
         { message: 'Two files with the same name!' },
      )
      .nullable(),
});

export const FolderSchema = z.object({
   name: z
      .string()
      .min(1, { message: 'Name of the folder is required!' })
      .refine(
         (name) => {
            const regex = /([A-Za-z0-9\-\_]+)/;
            const match = name.match(regex);
            if (match?.[0] === name) return true;
            return false;
         },
         {
            message:
               'The name of the folder can contain only letters, numbers, hypens(-) and underscores(_)',
         },
      ),
});
