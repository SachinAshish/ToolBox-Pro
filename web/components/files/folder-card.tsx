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

import { MoreVertical, Trash } from 'lucide-react';
import { useState } from 'react';
import { deleteFolder } from '@/data/files/delete';
import { useRouter } from 'next/navigation';
import { useToast } from '../ui/use-toast';

const FolderCardAction = ({ onFolderDelete }: { onFolderDelete: any }) => {
   const { toast } = useToast();
   const router = useRouter();
   const [open, setOpen] = useState(false);
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
                  <AlertDialogAction
                     onClick={async () => {
                        const result = await onFolderDelete();
                        if (result.success) {
                           toast({
                              title: result.success,
                              description: '1 folder was permanently deleted from Your Files.',
                           });
                           router.refresh();
                        }
                        setOpen(false);
                     }}
                  >
                     Continue
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
         <DropdownMenu>
            <DropdownMenuTrigger className="-mr-2 focus:outline-none">
               <MoreVertical className="h-5 w-5 cursor-pointer rounded-full text-muted-foreground transition-all hover:bg-gray-200 hover:text-primary active:text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
               <DropdownMenuItem className="text-destructive" onClick={() => setOpen(true)}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </>
   );
};

type Props = { path: string };

const FolderCard = ({ path }: Props) => {
   const folderName = path.split('/').slice(-2, -1);
   const onFolderDelete = async () => {
      return await deleteFolder(path);
   };
   return (
      <Card className="bg-secondary">
         <CardHeader className="p-5">
            <CardTitle className="flex items-start justify-between">
               <span className="truncate text-ellipsis text-nowrap text-sm">{folderName}</span>
               <FolderCardAction onFolderDelete={onFolderDelete} />
            </CardTitle>
         </CardHeader>
      </Card>
   );
};

export default FolderCard;
