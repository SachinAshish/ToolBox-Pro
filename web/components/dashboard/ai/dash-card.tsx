import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';
import React from 'react';

type Props = {
   className?: string;
};

const DashboardAiCard = ({ className }: Props) => {
   return (
      <div className={cn(className, 'rounded-lg border p-4')}>
         <div className="mb-2 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-xl font-semibold">
               <Bot /> AI tools
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

export default DashboardAiCard;
