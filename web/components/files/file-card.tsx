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
import { Button } from '../ui/button';

import {
   Loader2,
   MoreVertical,
   Trash,
   FileX,
   Copy,
   FolderInput,
   FilePen,
   Download,
   Eye,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { deleteFile } from '@/data/files/delete';
import { useToast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';
import { getFileUrl } from '@/data/files/read';
import axios from 'axios';
import { contentType } from '@/types';
import FileIcon from './file-icon';
import FileThumbnail from './file-thumbnail';
import DialogWrapper from '../dialog-wrapper';
import CopyFileForm from './copy-file-form';
import { getFileName } from '@/lib/utils';
import RenameFileForm from './rename-file-form';
import MoveFileForm from './move-file-form';
import { moveFileToTrash } from '@/data/files/trash';
import { format } from 'date-fns';

const FileCardAction = ({ filePath }: { filePath: string }) => {
   const router = useRouter();
   const { toast } = useToast();
   const [deleteOpen, setDeleteOpen] = useState(false);
   const [makeCopyOpen, setMakeCopyOpen] = useState(false);
   const [renameOpen, setRenameOpen] = useState(false);
   const [moveOpen, setMoveOpen] = useState(false);
   const fileName = getFileName(filePath);

   useEffect(() => {
      const isSelected = window.location.hash;
      if (isSelected.replace('#file-', '').replace('%20', ' ') === fileName) {
         const selected = document.getElementById(isSelected.substring(1));
         selected?.classList.add('highlight');
         selected?.scrollIntoView({ behavior: 'smooth' });
      }
   }, []);

   const onMoveToTrash = async () => {
      {
         const result = await moveFileToTrash(filePath);
         if (result.success) {
            toast({
               title: result.success,
               description: '1 file was moved to Trash.',
            });
            router.refresh();
         } else if (result.error) {
            toast({
               title: 'Could not move the file to trash!',
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
      {
         setDeleteOpen(false);
         toast({
            title: 'Deleting a file',
         });
         const result = await deleteFile(filePath);
         if (result.success) {
            toast({
               title: result.success,
               description: '1 file was permanently deleted from Your Files.',
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
      }
   };

   const onDownload = async () => {
      toast({
         title: 'Generating a private url to download',
      });
      const { error, success, url } = await getFileUrl(filePath);
      if (error) {
         toast({
            title: 'Could not download file!',
            description: error,
         });
      } else {
         toast({
            title: 'Private URL generated',
            description: success,
         });

         // only for using locally or for development
         const origin = window.location.origin;
         const host = origin.substring(origin.lastIndexOf('/') + 1, origin.lastIndexOf(':'));
         const fileUrl = url?.replace('object_store', host);

         window.open(fileUrl, '_blank');
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
         <DialogWrapper
            title={'Rename the ' + fileName + ' to'}
            open={renameOpen}
            onOpenChange={() => setRenameOpen((prev) => !prev)}
         >
            <RenameFileForm filePath={filePath} close={() => setRenameOpen(false)} />
         </DialogWrapper>
         <DialogWrapper
            title={'Create a copy of ' + fileName + ' to'}
            open={makeCopyOpen}
            onOpenChange={() => setMakeCopyOpen((prev) => !prev)}
         >
            <CopyFileForm filePath={filePath} close={() => setMakeCopyOpen(false)} />
         </DialogWrapper>
         <DialogWrapper
            title={'Move ' + fileName + ' to'}
            open={moveOpen}
            onOpenChange={() => setMoveOpen((prev) => !prev)}
         >
            <MoveFileForm filePath={filePath} close={() => setMoveOpen(false)} />
         </DialogWrapper>
         <DropdownMenu>
            <DropdownMenuTrigger className="z-10 -mr-2 focus:outline-none">
               <MoreVertical className="h-5 w-5 cursor-pointer rounded-full text-muted-foreground transition-all hover:bg-gray-200 hover:text-primary active:text-muted-foreground dark:hover:bg-gray-700" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
               <DropdownMenuItem onClick={() => {}}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
               </DropdownMenuItem>
               <DropdownMenuItem onClick={onDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => setRenameOpen(true)}>
                  <FilePen className="mr-2 h-4 w-4" />
                  Rename
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => setMoveOpen(true)}>
                  <FolderInput className="mr-2 h-4 w-4" />
                  Move
               </DropdownMenuItem>
               <DropdownMenuItem
                  onClick={() => {
                     setMakeCopyOpen(true);
                  }}
               >
                  <Copy className="mr-2 h-4 w-4" />
                  Make a Copy
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               <DropdownMenuItem
                  className="text-destructive dark:text-red-500"
                  onClick={() => setDeleteOpen(true)}
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

const FileCard = ({ content }: Props) => {
   const [fileUrl, setFileUrl] = useState<string>('');
   const { name, path, type, modified, size } = content;
   const { toast } = useToast();

   async function getFileLink() {
      let url = await getFileUrl(path);

      if (!url.url) {
         toast({
            title: url.error,
            description: 'This file could not be fetched due to and internal error.',
         });
         return;
      }
      // For local hosting/development only
      const downloadUrl = url.url.replace('object_store', 'localhost');
      const response = await axios.get(downloadUrl, { responseType: 'arraybuffer' });

      const buffer = response.data;
      const blob = new Blob([buffer]);
      const imageUrl = URL.createObjectURL(blob);

      setFileUrl(imageUrl);
   }

   useEffect(() => {
      getFileLink();
   }, []);

   return (
      <Card
         id={'file-' + name.replace(' ', '%20')}
         className="group flex h-full w-full cursor-pointer flex-col overflow-hidden bg-secondary p-0"
      >
         <CardHeader className="w-full p-5">
            <CardTitle className="flex max-w-full items-start justify-between">
               <Button
                  variant={'link'}
                  asChild
                  className="p-0"
                  onClick={() => {
                     // Todo: Preview the file on click
                     console.log('click');
                  }}
               >
                  <div className="flex h-5 w-[90%] flex-grow items-center gap-2">
                     <FileIcon mime={type} className="min-h-5 min-w-5" />
                     <span className="w-[90%] flex-grow truncate text-ellipsis text-nowrap text-sm">
                        {name}
                     </span>
                  </div>
               </Button>
               <FileCardAction filePath={path} />
            </CardTitle>
            <div className="text-xs text-muted-foreground">
               <p>Last Modified: {format(new Date(modified), 'dd-MM-yyyy')}</p>
               <p>Size: {Math.round(size * 10) / 10}Kb</p>
            </div>
         </CardHeader>
         <CardContent className="h-full w-full p-4 pt-0">
            <div className="aspect-[13/9] h-full w-full overflow-hidden rounded-lg bg-gray-300 p-0 group-hover:brightness-90 group-active:brightness-100 dark:bg-slate-500">
               {fileUrl ? (
                  <FileThumbnail fileUrl={fileUrl} fileType={type || 'default'} />
               ) : (
                  <div className="grid h-full w-full place-items-center">
                     <Loader2 className="h-8 w-8 animate-spin text-secondary-foreground opacity-50" />
                  </div>
               )}
            </div>
         </CardContent>
      </Card>
   );
};

export default FileCard;
