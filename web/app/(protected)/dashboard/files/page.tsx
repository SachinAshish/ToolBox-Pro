import DialogWrapper from '@/components/dialog-wrapper';
import FileCard from '@/components/files/file-card';
import FileForm from '@/components/files/file-form';
import FolderCard from '@/components/files/folder-card';
import FolderForm from '@/components/files/folder-form';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { listContent } from '@/data/files/list';
import { FilePlus, FolderPlus } from 'lucide-react';

type Props = {};

const FilesPage = async (props: Props) => {
   const contents = (await listContent('')).data;
   const files: string[] = [];
   const folders: string[] = [];
   contents?.map((content) =>
      content.endsWith('/') ? folders.push(content) : files.push(content),
   );
   return (
      <main className="container mx-auto pt-12">
         <div className="mb-8 flex items-center justify-between">
            <h1 className="text-4xl font-bold">Your Files</h1>
            <div className="flex gap-2">
               <DialogWrapper
                  title="Upload your files here"
                  trigger={
                     <Button className="flex gap-1.5">
                        <FilePlus />
                        File Upload
                     </Button>
                  }
               >
                  <FileForm />
               </DialogWrapper>
               <DialogWrapper
                  title="Upload your files here"
                  trigger={
                     <Button className="flex gap-1.5">
                        <FolderPlus />
                        New folder
                     </Button>
                  }
               >
                  <FolderForm />
               </DialogWrapper>
            </div>
         </div>
         <h3 className="pl-1 text-xl font-semibold">Folders</h3>
         <Separator className="mb-3 mt-1 w-full" />
         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
            {folders?.map((folder, index) => <FolderCard path={folder} key={index} />)}
         </div>
         <h3 className="mt-4 pl-1 text-xl font-semibold">Files</h3>
         <Separator className="mb-3 mt-1 w-full" />
         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
            {files?.map((file, index) => <FileCard path={file} key={index} />)}
         </div>
      </main>
   );
};

export default FilesPage;
