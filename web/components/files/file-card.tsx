'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { cn } from '@/lib/utils';
import { deleteFile } from '@/data/files/delete';
import { useToast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';

const FileCardAction = ({ onFileDelete }: { onFileDelete: any }) => {
   const router = useRouter();
   const { toast } = useToast();
   const [open, setOpen] = useState(false);
   return (
      <>
         <AlertDialog open={open}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                     This action cannot be undone. This will permanently delete this file.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                     onClick={async () => {
                        const result = await onFileDelete();
                        if (result.success) {
                           toast({
                              title: result.success,
                              description: '1 file was permanently deleted from Your Files.',
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

const FileCard = ({ path }: Props) => {
   const pathArr = path.split('/');
   const onFileDelete = async () => {
      return await deleteFile(path);
   };
   return (
      <Card>
         <CardHeader className="p-5">
            <CardTitle className="flex items-start justify-between">
               <span className="truncate text-ellipsis text-nowrap text-sm">
                  {pathArr.slice(-1)}
               </span>
               <FileCardAction onFileDelete={onFileDelete} />
            </CardTitle>
         </CardHeader>
         <CardContent>
            <p>Card Content</p>
         </CardContent>
      </Card>
   );
};

export default FileCard;
