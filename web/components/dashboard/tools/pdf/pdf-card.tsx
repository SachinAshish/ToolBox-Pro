import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

type Props = {
   title: string;
   description: string;
   iconBg: string;
   icon: React.ReactElement;
};

const PdfCard = ({ title, description, iconBg, icon }: Props) => {
   const modifiedIcon = React.cloneElement(icon, { className: 'w-20 h-20 text-white' });
   return (
      <Link href={'pdf/' + title.toLowerCase().replaceAll(' ', '-')}>
         <Card>
            <CardHeader className="flex flex-row items-center gap-3 p-3">
               <div className={cn(iconBg, 'h-full rounded p-3')}>{modifiedIcon}</div>
               <div className="!m-0 flex flex-col">
                  <CardTitle className="flex items-center gap-2 text-lg">{title}</CardTitle>
                  <CardDescription className="text-sm">{description}</CardDescription>
               </div>
            </CardHeader>
         </Card>
      </Link>
   );
};

export default PdfCard;
