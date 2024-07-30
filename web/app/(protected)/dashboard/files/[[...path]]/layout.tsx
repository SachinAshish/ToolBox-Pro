import DialogWrapper from '@/components/dialog-wrapper';
import FileForm from '@/components/files/create-file-form';
import FolderForm from '@/components/files/create-folder-form';
import CurrentFolderLocation from '@/components/files/current-folder-location';
import { Button } from '@/components/ui/button';
import { FilePlus, FolderPlus } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
   return (
      <main className="container mx-auto w-full py-12">
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

export default Layout;
