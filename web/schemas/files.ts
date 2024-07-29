import { withoutTrailingSlash } from '@/lib/utils';
import * as z from 'zod';

const checkFolderName = (name: string) => {
   const regex = /([A-Za-z0-9\-\_]+)/;
   const match = name.match(regex);
   if (match?.[0] === name) return true;
   return false;
};

const checkFileName = (name: string) => {
   const regex =
      /^(?!.{256,})(?!(aux|clock\$|con|nul|prn|com[1-9]|lpt[1-9])(?:$|\.))[^ ][ \.\w-$()+=[\];#@~,&amp;']+[^\. ]$/i;
   const match = name.match(regex);
   if (match?.[0] === name) return true;
   return false;
};

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
      .refine((files) => {
         for (const file of files) if (!checkFileName(file.name)) return false;
         return true;
      })
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

export const CopyFileSchema = z.object({
   path: z
      .string()
      .min(1, { message: 'The path is required to copy the file!' })
      .endsWith('/', { message: 'There must be a trailing slash("/")' })
      .startsWith('Files/')
      .refine(
         (path) => {
            path = withoutTrailingSlash(path);
            const pathArr = path.split('/');
            for (const folder of pathArr) if (!checkFolderName(folder)) return false;
            return true;
         },
         {
            message:
               'The name of the folders can contain only letters, numbers, hypens(-) and underscores(_)',
         },
      ),
   name: z
      .string()
      .min(3, { message: 'File name is required!' })
      .refine(
         (name: string) => {
            if (!checkFileName(name)) return false;
            return true;
         },
         { message: 'Not a valid file name!' },
      ),
});

export const CopyFolderSchema = z.object({
   path: z
      .string()
      .min(1, { message: 'The path is required to copy the folder!' })
      .endsWith('/', { message: 'There must be a trailing slash("/")' })
      .startsWith('Files/')
      .refine(
         (path) => {
            path = withoutTrailingSlash(path);
            const pathArr = path.split('/');
            for (const folder of pathArr) if (!checkFolderName(folder)) return false;
            return true;
         },
         {
            message:
               'The name of the folders can contain only letters, numbers, hypens(-) and underscores(_)',
         },
      ),
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

export const RenameFileSchema = z.object({
   name: z
      .string()
      .min(3, { message: 'File name is required!' })
      .refine(
         (name: string) => {
            if (!checkFileName(name)) return false;
            return true;
         },
         { message: 'Not a valid file name!' },
      ),
});

export const MoveFileSchema = z.object({
   path: z
      .string()
      .min(1, { message: 'The path is required to copy the file!' })
      .endsWith('/', { message: 'There must be a trailing slash("/")' })
      .startsWith('Files/')
      .refine(
         (path) => {
            path = withoutTrailingSlash(path);
            const pathArr = path.split('/');
            for (const folder of pathArr) if (!checkFolderName(folder)) return false;
            return true;
         },
         {
            message:
               'The name of the folders can contain only letters, numbers, hypens(-) and underscores(_)',
         },
      ),
});

export const MoveFolderSchema = z.object({
   path: z
      .string()
      .min(1, { message: 'The path is required to copy the file!' })
      .endsWith('/', { message: 'There must be a trailing slash("/")' })
      .startsWith('Files/')
      .refine(
         (path) => {
            path = withoutTrailingSlash(path);
            const pathArr = path.split('/');
            for (const folder of pathArr) if (!checkFolderName(folder)) return false;
            return true;
         },
         {
            message:
               'The name of the folders can contain only letters, numbers, hypens(-) and underscores(_)',
         },
      ),
});
