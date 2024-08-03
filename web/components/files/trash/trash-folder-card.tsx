'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
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

import { FaFolder } from 'react-icons/fa';
import { MoreVertical, FileX, ArchiveRestore } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useHash } from '@/hooks/use-hash';
import { deleteFolderFromTrash, restoreFolderFromTrash } from '@/data/files/trash';
import { withoutTrailingSlash } from '@/lib/utils';

const TrashFolderCardAction = ({
   trashPath,
   restorePath,
}: {
   trashPath: string;
   restorePath: string;
}) => {
   const { toast } = useToast();
   const router = useRouter();
   const [open, setOpen] = useState(false);

   const onDelete = async () => {
      setOpen(false);
      const result = await deleteFolderFromTrash(trashPath);
      if (result?.success) {
         toast({
            title: result.success,
            description: '1 folder was permanently deleted from Trash.',
         });
         router.refresh();
      } else if (result.error) {
         toast({
            title: 'Could not delete folder!',
            description: result.error,
         });
      } else {
         toast({
            title: 'Network error',
         });
      }
   };

   const onRestore = async () => {
      setOpen(false);
      const result = await restoreFolderFromTrash(trashPath, restorePath);
      if (result?.success) {
         toast({
            title: result.success,
            description: '1 folder was restored from Trash.',
         });
         router.refresh();
      } else if (result.error) {
         toast({
            title: 'Could not restore folder!',
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
         <AlertDialog open={open}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                     This action cannot be undone. This will permanently delete this folder and all
                     the files inside this folder.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-destructive dark:bg-red-500">
                     Continue
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
         <DropdownMenu>
            <DropdownMenuTrigger className="-mr-2 focus:outline-none">
               <MoreVertical className="h-5 w-5 cursor-pointer rounded-full text-muted-foreground transition-all hover:bg-gray-200 hover:text-primary active:text-muted-foreground dark:hover:bg-gray-700" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="start">
               <DropdownMenuItem onClick={onRestore}>
                  <ArchiveRestore className="mr-2 h-4 w-4" />
                  Restore
               </DropdownMenuItem>
               <DropdownMenuItem
                  className="text-destructive dark:text-red-500"
                  onClick={() => setOpen(true)}
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

const TrashFolderCard = ({ content }: Props) => {
   const { name, modified, path, filePath: restorePath } = content;

   const deletedFrom =
      'File/' +
      restorePath.substring(
         restorePath.indexOf('drive/') + 5,
         withoutTrailingSlash(restorePath).lastIndexOf('/'),
      );

   const hash = useHash();
   useEffect(() => {
      if (hash.replace('#dir-', '').replace('%20', ' ') === name) {
         const selected = document.getElementById(hash.substring(1));
         selected?.classList.add('highlight');
         selected?.scrollIntoView({ behavior: 'smooth' });
      }
   }, [hash]);

   return (
      <Card id={'dir-' + name} className="h-full w-full cursor-pointer bg-secondary p-0">
         <CardHeader className="w-full p-5">
            <CardTitle className="flex w-full items-start justify-between p-0">
               <Button
                  variant={'link'}
                  asChild
                  className="w-[90%] px-0 hover:no-underline"
                  disabled
               >
                  <div className="flex h-5 max-w-full items-center justify-start gap-2">
                     <FaFolder className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                     <span className="w-[90%] truncate text-ellipsis text-nowrap text-sm">
                        {name}
                     </span>
                  </div>
               </Button>
               <TrashFolderCardAction trashPath={path} restorePath={restorePath} />
            </CardTitle>
            <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
               <p>Deleted from: {deletedFrom.replaceAll('//', '/')}</p>
               <p>Deleted: {modified}</p>
            </div>
         </CardHeader>
      </Card>
   );
};

export default TrashFolderCard;
