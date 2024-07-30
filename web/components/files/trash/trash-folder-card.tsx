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
import { contentType } from '@/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const TrashFolderCardAction = ({ name }: { name: string }) => {
   const { toast } = useToast();
   const router = useRouter();
   const [open, setOpen] = useState(false);

   useEffect(() => {
      const isSelected = window.location.hash;
      if (isSelected.replace('#dir-', '').replace('%20', ' ') === name) {
         const selected = document.getElementById(isSelected.substring(1));
         selected?.classList.add('highlight');
         selected?.scrollIntoView({ behavior: 'smooth' });
      }
   }, []);

   const onDelete = async () => {
      // toast({
      //    title: 'Deleting a Folder',
      // });
      // const result = await deleteFolder(path);
      // if (result?.success) {
      //    toast({
      //       title: result.success,
      //       description: '1 folder was permanently deleted from Your Files.',
      //    });
      //    router.refresh();
      // } else {
      //    toast({
      //       title: result?.error,
      //       description: 'Something went wrong while deleting the folder',
      //    });
      // }
      setOpen(false);
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
            <DropdownMenuContent className="w-40" align="start">
               <DropdownMenuItem onClick={() => {}}>
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

type Props = { content: contentType };

const TrashFolderCard = ({ content }: Props) => {
   const { name } = content;

   return (
      <Card id={'dir-' + name} className="h-full w-full cursor-pointer bg-secondary p-0">
         <CardHeader className="w-full p-0">
            <CardTitle className="flex w-full items-start justify-between p-5">
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
               <TrashFolderCardAction name={name} />
            </CardTitle>
         </CardHeader>
      </Card>
   );
};

export default TrashFolderCard;
