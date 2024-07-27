import FileCard from '@/components/files/file-card';
import FolderCard from '@/components/files/folder-card';
import { Separator } from '@/components/ui/separator';
import { listContent } from '@/data/files/list';
import { contentType } from '@/types';
import Image from 'next/image';

type Props = {
   params: { path: string[] | undefined };
};

const FilesPage = async ({ params }: Props) => {
   const contents = (await listContent(params.path?.join('/') || '', 1)).data;
   const files: contentType[] = [];
   const folders: contentType[] = [];
   contents?.map((content) => {
      if (content.type === 'directory') folders.push(content);
      else files.push(content);
   });
   return (
      <>
         {!!folders.length && (
            <>
               <h3 className="pl-1 text-xl font-semibold">Folders</h3>
               <Separator className="mb-3 mt-1 w-full" />
               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
                  {folders?.map((folder, index) => <FolderCard content={folder} key={index} />)}
               </div>
            </>
         )}
         {!!files.length && (
            <>
               <h3 className="mt-4 pl-1 text-xl font-semibold">Files</h3>
               <Separator className="mb-3 mt-1 w-full" />
               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
                  {files?.map((file, index) => <FileCard content={file} key={index} />)}
               </div>
            </>
         )}
         {!folders.length && !files.length && (
            <div className="grid h-[500px] w-full place-items-center">
               <div className="text-md flex flex-col items-center gap-4 text-gray-500">
                  <Image src={'/add-file.svg'} height={300} width={300} alt="no files" />
                  <div className="text-center">
                     <p>No file or folder found!</p>
                     <p>
                        <span className="font-semibold">Upload</span> a file or{' '}
                        <span className="font-semibold">Create</span> a new folder.
                     </p>
                  </div>
               </div>
            </div>
         )}
      </>
   );
};

export default FilesPage;
