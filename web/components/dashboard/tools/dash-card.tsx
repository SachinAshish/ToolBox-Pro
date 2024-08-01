import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, PocketKnife } from 'lucide-react';
import React from 'react';

type Props = {};

const DashboardToolsCard = (props: Props) => {
   return (
      <div className="rounded-lg border p-4">
         <div className="mb-2 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-xl font-semibold">
               <PocketKnife />
               Common tools
            </h3>
         </div>
         <Separator className="mb-3 w-full" />
         <div className="grid min-h-56 w-full place-items-center text-muted-foreground">
            <div className="text-center">
               <p>To be made</p>
            </div>
         </div>
      </div>
   );
};

export default DashboardToolsCard;
