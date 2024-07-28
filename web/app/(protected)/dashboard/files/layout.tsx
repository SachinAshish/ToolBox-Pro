import DialogWrapper from '@/components/dialog-wrapper';
import CurrentFolderLocation from '@/components/files/current-folder-location';
import FileForm from '@/components/files/create-file-form';
import FolderForm from '@/components/files/create-folder-form';
import { Button } from '@/components/ui/button';
import { FilePlus, FolderPlus } from 'lucide-react';

type Props = {
   children: React.ReactNode;
};

const FileLayout = ({ children }: Props) => {
   return (
      <main className="container mx-auto py-12">
         <div className="mb-4 flex items-center justify-between">
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
                  title="Name your folder"
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
         <CurrentFolderLocation />
         {children}
      </main>
   );
};

export default FileLayout;
