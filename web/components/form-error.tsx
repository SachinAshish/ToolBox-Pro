import { CircleX } from 'lucide-react';
import React from 'react';

type Props = {
   message?: string;
};

export default function FormError({ message }: Props) {
   if (!message) return null;
   return (
      <div className="flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
         <CircleX />
         <p dangerouslySetInnerHTML={{ __html: message }} />
      </div>
   );
}
