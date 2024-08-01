import { X } from 'lucide-react';
import React from 'react';

type Props = {
   service: React.ReactNode;
   time: string;
   title: React.ReactNode;
   description: React.ReactNode;
};

const NotificationCard = ({ service, time, title, description }: Props) => {
   return (
      <div className="relative w-full overflow-hidden rounded-lg">
         <div className="group absolute bottom-0 left-0 right-0 top-0 grid place-items-center bg-background/80 opacity-0 transition hover:opacity-100">
            <X className="h-10 w-10 text-red-500" />
         </div>
         <div className="bg-secondary p-4">
            <div className="flex items-start justify-between">
               <div className="dark: text-xs font-semibold capitalize">{service}</div>
               <span className="text-xs text-muted-foreground">{time}</span>
            </div>
            <div className="font-semibold">{title}</div>
            <div className="text-sm text-muted-foreground">{description}</div>
         </div>
      </div>
   );
};

export default NotificationCard;
