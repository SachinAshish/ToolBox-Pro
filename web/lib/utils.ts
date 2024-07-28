import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export const sleep = (milliseconds: number) =>
   new Promise((resolve) => setTimeout(resolve, milliseconds));

export const getFileName = (path: string) => path.substring(path.lastIndexOf('/') + 1);

export const getFileExtension = (path: string) => path.substring(path.lastIndexOf('.'));

export const getFilePath = (path: string) =>
   path.substring(0, path.length - getFileName(path).length);

export const withTrailingSlash = (path: string) => (path.endsWith('/') ? path : path + '/');

export const withLeadingSlash = (path: string) => (path.startsWith('/') ? path : '/' + path);

export const withoutTrailingSlash = (path: string) =>
   path.endsWith('/') ? path.substring(1, path.length - 1) : path;

export const withoutLeadingSlash = (path: string) =>
   path.startsWith('/') ? path.substring(1) : path;
