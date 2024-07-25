import { CircleCheck } from 'lucide-react';
import React from 'react';

type Props = {
   message?: string;
};

export default function FormSuccess({ message }: Props) {
   if (!message) return null;
   return (
      <div className="flex items-center gap-x-2 rounded-md bg-emerald-500/15 p-3 text-sm text-emerald-500">
         <CircleCheck />
         <p dangerouslySetInnerHTML={{ __html: message }} />
      </div>
   );
}
