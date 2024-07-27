// @ts-nocheck
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
import { fileTypeFromFile } from 'file-type';
import { contentType } from '@/types';
import FileIcon from './file-icon';
import FileThumbnail from './file-thumbnail';
import { BarLoader } from 'react-spinners';
import Link from 'next/link';

const FileCardAction = ({ filePath }: { filePath: string }) => {
   const router = useRouter();
   const { toast } = useToast();
   const [open, setOpen] = useState(false);

   const onDelete = async () => {
      {
         setOpen(false);
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
                  <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
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

const FileCard = ({ content }: Props) => {
   const [fileUrl, setFileUrl] = useState<string>('');
   const { name, path, type } = content;

   async function getFileLink() {
      let url = await getFileUrl(path);

      // For local hosting/development only
      url = url.url?.replace('object_store', 'localhost');
      const response = await axios.get(url, { responseType: 'arraybuffer' });

      const buffer = response.data;
      const blob = new Blob([buffer]);
      const imageUrl = URL.createObjectURL(blob);

      setFileUrl(imageUrl);
   }
   useEffect(() => {
      getFileLink();
   }, []);
   return (
      <Card className="group flex h-full w-full cursor-pointer flex-col overflow-hidden bg-secondary p-0">
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
         </CardHeader>
         <CardContent className="h-full w-full p-4 pt-0">
            <div className="aspect-[13/9] h-full w-full overflow-hidden rounded-lg bg-gray-300 p-0 group-hover:brightness-90 group-active:brightness-100 dark:bg-slate-500">
               {fileUrl ? (
                  <FileThumbnail fileUrl={fileUrl} fileType={type} />
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
