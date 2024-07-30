import { slashReplace, trashDetailsSeparator } from '@/constants';
import { getFileExtension } from '../utils';

export const parseTrashName = (name: string, isDirectory: boolean) => {
   const actualName = name.substring(0, name.lastIndexOf(trashDetailsSeparator) - 1);
   const details = name.substring(
      name.lastIndexOf(trashDetailsSeparator) + trashDetailsSeparator.length + 1,
      isDirectory ? name.length : name.lastIndexOf('.'),
   );
   const extension = isDirectory ? '' : getFileExtension(name);

   const detailJSON = JSON.parse(details.replaceAll(slashReplace, '/'));

   return {
      name: actualName + extension,
      ...detailJSON,
   };
};
