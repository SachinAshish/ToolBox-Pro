import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { NotebookPen, Plus } from 'lucide-react';
import React from 'react';

type Props = {};

const DashboardNotesCard = (props: Props) => {
   return (
      <div className="rounded-lg border p-4">
         <div className="mb-2 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-xl font-semibold">
               <NotebookPen />
               Notes
            </h3>
            <Button size={'sm'} className="flex h-[unset] gap-1 px-2 py-1 text-sm">
               <Plus className="h-4 w-4" />
               New
            </Button>
         </div>
         <Separator className="mb-3 w-full" />
         <div className="grid min-h-56 w-full place-items-center text-muted-foreground">
            <div className="text-center">
               <p>No notes found</p>
               <p>
                  Click <span className="rounded-lg bg-secondary px-1 font-semibold">+New</span> to
                  add new notes
               </p>
            </div>
         </div>
      </div>
   );
};

export default DashboardNotesCard;