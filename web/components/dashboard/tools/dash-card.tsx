import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { PocketKnife } from 'lucide-react';
import React from 'react';
import DashboardToolCard from './dash-tool-card';
import { TOOLS_URL } from '@/routes';

type Props = {
   className?: string;
};

const DashboardToolsCard = ({ className }: Props) => {
   const tools = [
      {
         title: 'PDF Tools',
         description: 'Solve all your PDF problems',
         className: 'bg-purple-500',
         href: TOOLS_URL + '/pdf',
      },
      {
         title: 'Image Tools',
         description: 'Solve all your Image problems',
         className: 'bg-red-500',
         href: TOOLS_URL + '/image',
      },
      {
         title: 'File Tools',
         description: 'Solve all your File problems',
         className: 'bg-emerald-500',
         href: TOOLS_URL + '/file',
      },
   ];
   return (
      <div className={cn(className, 'rounded-lg border p-4')}>
         <div className="mb-2 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-xl font-semibold">
               <PocketKnife />
               Common tools
            </h3>
         </div>
         <Separator className="mb-3 w-full" />
         <div className="flex w-full flex-col gap-2 text-muted-foreground">
            {tools.map((tool, index) => (
               <DashboardToolCard key={index} {...tool} />
            ))}
         </div>
      </div>
   );
};

export default DashboardToolsCard;
