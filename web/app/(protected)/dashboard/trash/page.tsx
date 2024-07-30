import TrashFileCard from '@/components/files/trash/trash-file-card';
import TrashFolderCard from '@/components/files/trash/trash-folder-card';
import { Separator } from '@/components/ui/separator';
import { listTrashContent } from '@/data/files/list';
import { contentType } from '@/types';
import Image from 'next/image';

type Props = {};

const TrashPage = async ({}: Props) => {
   const contents = (await listTrashContent()).data;
   const files: any[] = [];
   const folders: any[] = [];
   contents?.map((content: contentType) => {
      if (content.type === 'directory') folders.push(content);
      else files.push(content);
   });
   return (
      <>
         {!!folders.length && (
            <>
               <h3 className="pl-1 text-xl font-semibold">Folders</h3>
               <Separator className="mb-3 mt-1 w-full" />
               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                  {folders?.map((folder, index) => (
                     <TrashFolderCard content={folder} key={index} />
                  ))}
               </div>
            </>
         )}
         {!!files.length && (
            <>
               <h3 className="mt-4 pl-1 text-xl font-semibold">Files</h3>
               <Separator className="mb-3 mt-1 w-full" />
               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                  {files?.map((file, index) => <TrashFileCard content={file} key={index} />)}
               </div>
            </>
         )}
         {!folders.length && !files.length && (
            <div className="grid h-[600px] w-full place-items-center">
               <div className="text-md flex flex-col items-center gap-4 text-gray-500">
                  <Image src={'/trash.svg'} height={300} width={300} alt="no files" />
                  <div className="text-center">
                     <p>Move Items you don't need to Trash.</p>
                     <p>Items in trash will be deleted forever after 30 days.</p>
                  </div>
               </div>
            </div>
         )}
      </>
   );
};

export default TrashPage;
