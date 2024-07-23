import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
   label: string;
};

export function HeaderLabel({ label }: Props) {
   return (
      <div className="flex w-full flex-col items-center justify-center gap-y-4">
         <h1 className={cn('text-3xl font-semibold')}>Auth</h1>
         <p className="text-muted-foreground">{label}</p>
      </div>
   );
}
