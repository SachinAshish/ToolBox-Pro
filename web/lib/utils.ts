import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export const sleep = (milliseconds: number) => {
   return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
