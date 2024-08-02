import { Separator } from '@/components/ui/separator';
import { CgMergeVertical } from 'react-icons/cg';
import { IoMdImage } from 'react-icons/io';
import React from 'react';
import PdfCard from '@/components/dashboard/tools/pdf/pdf-card';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

type Props = {};

const ToolsPage = (props: Props) => {
   const pdfTools = [
      {
         title: 'Merge',
         description: 'Easily merge multiple pdf files into a single one.',
         iconBg: 'bg-purple-500',
         icon: <CgMergeVertical />,
      },
      {
         title: 'Image to PDF',
         description: 'Easily convert image(jpg, png) to PDF.',
         iconBg: 'bg-yellow-500',
         icon: <IoMdImage />,
      },
   ];
   return (
      <main>
         <div className="mb-4 flex items-center justify-between">
            <h1 className="text-4xl font-bold">Tools</h1>
         </div>
         <div className="mb-4 flex w-full items-center justify-between rounded-lg bg-secondary p-3 px-4 text-sm text-muted-foreground">
            We offer PDF, image and other online tools to make your life easier.
         </div>
         <div className="flex justify-between">
            <h3 className="pl-1 text-xl font-semibold">PDF</h3>
            <Link
               href="tools/pdf"
               className={cn(
                  buttonVariants({ variant: 'default', size: 'sm' }),
                  'group flex h-[unset] gap-1 px-2 py-1 text-sm',
               )}
            >
               View all
               <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
         </div>
         <Separator className="mb-3 mt-1 w-full" />
         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {pdfTools.map((tool, index) => (
               <PdfCard {...tool} key={index} />
            ))}
         </div>
      </main>
   );
};

export default ToolsPage;
