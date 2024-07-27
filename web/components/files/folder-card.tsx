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

import { FaFolder } from 'react-icons/fa';
import {
   MoreVertical,
   Trash,
   FileX,
   Copy,
   FolderInput,
   FilePen,
   FolderArchive,
   FolderOpen,
} from 'lucide-react';
import { useState } from 'react';
import { deleteFolder } from '@/data/files/delete';
import { usePathname, useRouter } from 'next/navigation';
import { useToast } from '../ui/use-toast';
import { contentType } from '@/types';
import { Button } from '../ui/button';

const FolderCardAction = ({ path }: { path: string }) => {
   const { toast } = useToast();
   const router = useRouter();
   const [open, setOpen] = useState(false);

   const onDelete = async () => {
      const result = await deleteFolder(path);
      toast({
         title: 'Deleting a Folder',
      });
      if (result?.success) {
         toast({
            title: result.success,
            description: '1 folder was permanently deleted from Your Files.',
         });
         router.refresh();
      }
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
                  <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
         <DropdownMenu>
            <DropdownMenuTrigger className="-mr-2 focus:outline-none">
               <MoreVertical className="h-5 w-5 cursor-pointer rounded-full text-muted-foreground transition-all hover:bg-gray-200 hover:text-primary active:text-muted-foreground dark:hover:bg-gray-700" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
               <DropdownMenuItem onClick={() => {}}>
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Open
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => {}}>
                  <FolderArchive className="mr-2 h-4 w-4" />
                  Download zip
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => {}}>
                  <FilePen className="mr-2 h-4 w-4" />
                  Rename
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => {}}>
                  <FolderInput className="mr-2 h-4 w-4" />
                  Move
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => {}}>
                  <Copy className="mr-2 h-4 w-4" />
                  Make a Copy
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               <DropdownMenuItem
                  className="text-destructive dark:text-red-500"
                  onClick={() => setOpen(true)}
               >
                  <FileX className="mr-2 h-4 w-4" />
                  Delete
               </DropdownMenuItem>
               <DropdownMenuItem className="text-destructive dark:text-red-500" onClick={() => {}}>
                  <Trash className="mr-2 h-4 w-4" />
                  Move to Trash
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </>
   );
};

type Props = { content: contentType };

const FolderCard = ({ content }: Props) => {
   const router = useRouter();
   const pathname = usePathname();
   const { name, path } = content;
   return (
      <Card className="h-full w-full cursor-pointer bg-secondary p-0">
         <CardHeader className="w-full p-0">
            <CardTitle className="flex w-full items-start justify-between p-5">
               <Button
                  variant={'link'}
                  asChild
                  onClick={() => {
                     router.push(pathname + '/' + name);
                  }}
                  className="w-full px-0"
               >
                  <div className="flex h-5 w-full items-center gap-2">
                     <FaFolder className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                     <span className="w-[90%] truncate text-ellipsis text-nowrap text-sm">
                        {name}
                     </span>
                  </div>
               </Button>
               <FolderCardAction path={path} />
            </CardTitle>
         </CardHeader>
      </Card>
   );
};

export default FolderCard;
