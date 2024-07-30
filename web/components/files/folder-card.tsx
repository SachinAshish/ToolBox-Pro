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
import { useState, useEffect } from 'react';
import { deleteFolder } from '@/data/files/delete';
import { usePathname, useRouter } from 'next/navigation';
import { useToast } from '../ui/use-toast';
import { contentType } from '@/types';
import { Button } from '../ui/button';
import { createZip } from '@/data/files/zip';
import Link from 'next/link';
import DialogWrapper from '../dialog-wrapper';
import CopyFolderForm from './copy-folder-form';
import { getFileName, withoutTrailingSlash } from '@/lib/utils';
import RenameFolderForm from './rename-folder-form';
import MoveFolderForm from './move-folder-form';
import { moveFolderToTrash } from '@/data/files/trash';

const FolderCardAction = ({ path, openLink }: { path: string; openLink: string }) => {
   const { toast } = useToast();
   const router = useRouter();
   const [open, setOpen] = useState(false);
   const [makeCopyOpen, setMakeCopyOpen] = useState<boolean>(false);
   const [renameOpen, setRenameOpen] = useState(false);
   const [moveOpen, setMoveOpen] = useState(false);
   const folderName: string = getFileName(withoutTrailingSlash(openLink));

   useEffect(() => {
      const isSelected = window.location.hash;
      if (isSelected.replace('#dir-', '').replace('%20', ' ') === folderName) {
         const selected = document.getElementById(isSelected.substring(1));
         selected?.classList.add('highlight');
         selected?.scrollIntoView({ behavior: 'smooth' });
      }
   }, []);

   const onMoveToTrash = async () => {
      {
         toast({
            title: 'Moving a file to trash',
         });
         const result = await moveFolderToTrash(path);
         if (result.success) {
            toast({
               title: result.success,
               description: '1 folder was moved to Trash.',
            });
            router.refresh();
         } else if (result.error) {
            toast({
               title: 'Could not move the folder to trash!',
               description: result.error,
            });
         } else {
            toast({
               title: 'Network error',
            });
         }
      }
   };

   const onDelete = async () => {
      toast({
         title: 'Deleting a Folder',
      });
      const result = await deleteFolder(path);
      if (result?.success) {
         toast({
            title: result.success,
            description: '1 folder was permanently deleted from Your Files.',
         });
         router.refresh();
      } else {
         toast({
            title: result?.error,
            description: 'Something went wrong while deleting the folder',
         });
      }
      setOpen(false);
   };

   const onZip = async () => {
      toast({
         title: 'Creating a zip file for ' + path.split('/').slice(-2, -1),
      });
      const result = await createZip(path);
      if (result.success) {
         toast({
            title: result.success,
            description: 'The zip file must be present in the parent of the folder.',
         });
         router.refresh();
      } else {
         toast({
            title: result.error,
            description: 'Something went wrong while creating the zip file',
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
         <DialogWrapper
            title={'Create a copy of ' + folderName + ' to'}
            open={makeCopyOpen}
            onOpenChange={() => setMakeCopyOpen((prev) => !prev)}
         >
            <CopyFolderForm folderName={folderName} close={() => setMakeCopyOpen(false)} />
         </DialogWrapper>
         <DialogWrapper
            title={'Rename the ' + folderName + ' to'}
            open={renameOpen}
            onOpenChange={() => setRenameOpen((prev) => !prev)}
         >
            <RenameFolderForm folderPath={path} close={() => setRenameOpen(false)} />
         </DialogWrapper>
         <DialogWrapper
            title={'Move the folder ' + folderName + '/ to'}
            open={moveOpen}
            onOpenChange={() => setMoveOpen((prev) => !prev)}
         >
            <MoveFolderForm folderPath={path} close={() => setMoveOpen(false)} />
         </DialogWrapper>
         <DropdownMenu>
            <DropdownMenuTrigger className="-mr-2 focus:outline-none">
               <MoreVertical className="h-5 w-5 cursor-pointer rounded-full text-muted-foreground transition-all hover:bg-gray-200 hover:text-primary active:text-muted-foreground dark:hover:bg-gray-700" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
               <Link href={openLink}>
                  <DropdownMenuItem>
                     <FolderOpen className="mr-2 h-4 w-4" />
                     Open
                  </DropdownMenuItem>
               </Link>
               <DropdownMenuItem onClick={onZip}>
                  <FolderArchive className="mr-2 h-4 w-4" />
                  Create zip
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => setRenameOpen(true)}>
                  <FilePen className="mr-2 h-4 w-4" />
                  Rename
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => setMoveOpen(true)}>
                  <FolderInput className="mr-2 h-4 w-4" />
                  Move
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => setMakeCopyOpen(true)}>
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
               <DropdownMenuItem
                  className="text-destructive dark:text-red-500"
                  onClick={onMoveToTrash}
               >
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
      <Card id={'dir-' + name} className="h-full w-full cursor-pointer bg-secondary p-0">
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
               <FolderCardAction path={path} openLink={pathname + '/' + name} />
            </CardTitle>
         </CardHeader>
      </Card>
   );
};

export default FolderCard;
