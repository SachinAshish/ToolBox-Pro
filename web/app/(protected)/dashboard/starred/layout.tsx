import { Button } from '@/components/ui/button';
import React from 'react';

type Props = {
   children: React.ReactNode;
};

const StarredLayout = ({ children }: Props) => {
   return (
      <main>
         <div className="mb-4 flex items-center justify-between">
            <h1 className="text-4xl font-bold">Starred</h1>
            <Button>Empty Trash</Button>
         </div>

         <div className="mb-4 flex w-full items-center justify-between rounded-lg bg-secondary p-3 px-4 text-sm text-muted-foreground">
            Add stars to things that you want to easily find later.
         </div>
         {children}
      </main>
   );
};

export default StarredLayout;
