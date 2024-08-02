import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

type Props = {
   title: string;
   description: string;
   href: string;
   className?: string;
};

const DashboardToolCard = ({ title, description, href, className }: Props) => {
   return (
      <Link href={href}>
         <Card
            className={cn(className, 'group h-full transition hover:scale-105 active:scale-100')}
         >
            <CardHeader className="p-3">
               <CardTitle className="text-md flex justify-between gap-2 text-white">
                  {title} <ArrowRight className="transition group-hover:translate-x-1" />
               </CardTitle>
               <CardDescription className="text-xs text-white">{description}</CardDescription>
            </CardHeader>
         </Card>
      </Link>
   );
};

export default DashboardToolCard;
