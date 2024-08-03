'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useHash } from '@/hooks/use-hash';
import { deleteFileFromTrash, restoreFileFromTrash } from '@/data/files/trash';

const FileCardAction = ({
   deletePath,
   restorePath,
}: {
   deletePath: string;
   restorePath: string;
}) => {
   const router = useRouter();
   const { toast } = useToast();
   const [deleteOpen, setDeleteOpen] = useState(false);

   const onDelete = async () => {
      setDeleteOpen(false);
      const result = await deleteFileFromTrash(deletePath);
      if (result.success) {
         toast({
            title: result.success,
            description: '1 file was permanently deleted from Trash.',
         });
         router.refresh();
      } else if (result.error) {
         toast({
            title: 'Could not delete file!',
            description: result.error,
         });
      } else {
         toast({
            title: 'Network error',
         });
      }
   };

   const onRestore = async () => {
      const result = await restoreFileFromTrash(deletePath, restorePath);
      if (result.success) {
         toast({
            title: result.success,
            description: '1 file was restored from Trash.',
         });
         router.refresh();
      } else if (result.error) {
         toast({
            title: 'Could not delete file!',
            description: result.error,
         });
      } else {
         toast({
            title: 'Network error',
         });
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
            <DropdownMenuContent className="w-48" align="start">
               <DropdownMenuItem onClick={onRestore}>
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

const TrashFileCard = ({ content }: Props) => {
   const { name, type, path, modified, filePath: restorePath, size } = content;

   const deletedFrom =
      'File' +
      restorePath.substring(restorePath.indexOf('drive/') + 6, restorePath.lastIndexOf('/'));

   const hash = useHash();
   useEffect(() => {
      if (hash.replace('#file-', '').replace('%20', ' ') === name) {
         const selected = document.getElementById(hash.substring(1));
         selected?.classList.add('highlight');
         selected?.scrollIntoView({ behavior: 'smooth' });
      }
   }, [hash]);

   return (
      <Card
         id={'file-' + name.replace(' ', '%20')}
         className="group flex h-full w-full cursor-pointer flex-col overflow-hidden bg-secondary p-0"
      >
         <CardHeader className="w-full p-5">
            <CardTitle className="flex max-w-full items-start justify-between">
               <Button variant={'link'} asChild className="w-full p-0 hover:no-underline" disabled>
                  <div className="flex h-5 max-w-[90%] flex-grow items-center justify-between gap-2">
                     <FileIcon mime={type} className="min-h-5 min-w-5" />
                     <span className="w-[90%] flex-grow truncate text-ellipsis text-nowrap text-sm">
                        {name}
                     </span>
                  </div>
               </Button>
               <FileCardAction deletePath={path} restorePath={restorePath} />
            </CardTitle>
            <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
               <p>Deleted from: {deletedFrom}</p>
               <p>Deleted: {modified}</p>
               <p>Size: {size}</p>
            </div>
         </CardHeader>
      </Card>
   );
};

export default TrashFileCard;
