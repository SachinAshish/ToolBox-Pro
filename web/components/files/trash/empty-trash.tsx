'use client';
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
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { emptyTrash } from '@/data/files/trash';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

type Props = {};

const EmptyTrashButton = (props: Props) => {
   const [open, setOpen] = useState(false);
   const { toast } = useToast();
   const router = useRouter();

   const onClick = async () => {
      const result = await emptyTrash();
      if (result.success) {
         toast({
            title: 'Trash was emptied successfully',
            description: result.success,
         });
         router.refresh();
      } else if (result.error) {
         toast({
            title: 'Could not empty the trash!',
            description: result.error,
         });
      } else {
         toast({
            title: 'Network error',
         });
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
                     This action cannot be undone. This will permanently delete all the files and
                     folders in the trash.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onClick} className="bg-destructive dark:bg-red-500">
                     Continue
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
         <Button onClick={() => setOpen(true)}>Empty Trash</Button>
      </>
   );
};

export default EmptyTrashButton;
