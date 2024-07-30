'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
   DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { MoreVertical, FileX, ArchiveRestore } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import FileIcon from '../file-icon';
import FileThumbnail from '../file-thumbnail';
import { getDateString } from '@/lib/files/get-date';
import { getFileSize } from '@/lib/files/get-size';

const FileCardAction = ({ name }: { name: string }) => {
   const router = useRouter();
   const { toast } = useToast();
   const [deleteOpen, setDeleteOpen] = useState(false);

   useEffect(() => {
      const isSelected = window.location.hash;
      if (isSelected.replace('#file-', '').replace('%20', ' ') === name) {
         const selected = document.getElementById(isSelected.substring(1));
         selected?.classList.add('highlight');
         selected?.scrollIntoView({ behavior: 'smooth' });
      }
   }, []);

   const onDelete = async () => {
      {
         setDeleteOpen(false);
         // toast({
         //    title: 'Deleting a file',
         // });
         // const result = await deleteFile(filePath);
         // if (result.success) {
         //    toast({
         //       title: result.success,
         //       description: '1 file was permanently deleted from Your Files.',
         //    });
         //    router.refresh();
         // } else if (result.error) {
         //    toast({
         //       title: 'Could not delete file!',
         //       description: result.error,
         //    });
         // } else {
         //    toast({
         //       title: 'Network error',
         //    });
         // }
      }
   };

   return (
      <>
         <AlertDialog open={deleteOpen}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                     This action cannot be undone. This will permanently delete this file.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteOpen(false)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-destructive dark:bg-red-500">
                     Continue
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
         <DropdownMenu>
            <DropdownMenuTrigger className="z-10 -mr-2 focus:outline-none">
               <MoreVertical className="h-5 w-5 cursor-pointer rounded-full text-muted-foreground transition-all hover:bg-gray-200 hover:text-primary active:text-muted-foreground dark:hover:bg-gray-700" />
            </DropdownMenuTrigger>
            <DropdownMenuSeparator />
            <DropdownMenuContent className="w-40" align="start">
               <DropdownMenuItem onClick={() => {}}>
                  <ArchiveRestore className="mr-2 h-4 w-4" />
                  Restore
               </DropdownMenuItem>
               <DropdownMenuItem
                  className="text-destructive dark:text-red-500"
                  onClick={() => setDeleteOpen(true)}
               >
                  <FileX className="mr-2 h-4 w-4" />
                  Delete
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </>
   );
};

type Props = { content: any };

const FileCard = ({ content }: Props) => {
   const { name, type, modified, filePath: restorePath, size } = content;

   return (
      <Card
         id={'file-' + name.replace(' ', '%20')}
         className="group flex h-full w-full cursor-pointer flex-col overflow-hidden bg-secondary p-0"
      >
         <CardHeader className="w-full p-5">
            <CardTitle className="flex max-w-full items-start justify-between">
               <Button variant={'link'} asChild className="w-full p-0 hover:no-underline">
                  <div className="flex h-5 max-w-[90%] flex-grow items-center justify-between gap-2">
                     <FileIcon mime={type} className="min-h-5 min-w-5" />
                     <span className="w-[90%] flex-grow truncate text-ellipsis text-nowrap text-sm">
                        {name}
                     </span>
                  </div>
               </Button>
               <FileCardAction name={name} />
            </CardTitle>
            <div className="text-xs text-muted-foreground">
               <p>Last Modified: {modified}</p>
               <p>Size: {size}</p>
            </div>
         </CardHeader>
         <CardContent className="h-full w-full p-4 pt-0">
            <div className="aspect-[13/9] h-full w-full overflow-hidden rounded-lg bg-gray-300 p-0 group-hover:brightness-90 group-active:brightness-100 dark:bg-slate-500">
               <FileThumbnail fileUrl={'no-url'} fileType={'no-preview'} />
            </div>
         </CardContent>
      </Card>
   );
};

export default FileCard;
