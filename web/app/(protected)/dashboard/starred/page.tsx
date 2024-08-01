import FileCard from '@/components/files/file-card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import React from 'react';

type Props = {};

const StarredPage = (props: Props) => {
   const files: any[] = [];
   return (
      <>
         {!!files.length && (
            <>
               <h3 className="mt-4 pl-1 text-xl font-semibold">Files</h3>
               <Separator className="mb-3 mt-1 w-full" />
               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                  {files?.map((file, index) => <FileCard content={file} key={index} />)}
               </div>
            </>
         )}
         {!files.length && (
            <div className="grid h-[600px] w-full place-items-center">
               <div className="text-md flex flex-col items-center gap-4 text-gray-500">
                  <Image src={'/add-star.svg'} height={300} width={300} alt="no files" />
                  <div className="text-center">
                     <p>No starred items</p>
                     <p>Add stars to things that you want to easily find later.</p>
                  </div>
               </div>
            </div>
         )}
      </>
   );
};

export default StarredPage;
