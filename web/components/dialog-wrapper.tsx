import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

type Props = {
   title: string;
   trigger?: React.ReactNode;
   children: React.ReactNode;
};

const DialogWrapper = ({ title, trigger, children, ...props }: Props) => {
   return (
      <Dialog {...props}>
         {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
         <DialogContent>
            <DialogHeader>
               <DialogTitle className="mb-4">{title}</DialogTitle>
            </DialogHeader>
            {children}
         </DialogContent>
      </Dialog>
   );
};

export default DialogWrapper;
