'use client';
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Copy } from 'lucide-react';
import { cn, withoutLeadingSlash, withoutTrailingSlash } from '@/lib/utils';
import { FILES_URL } from '@/routes';

type Props = {};

const CurrentFolderLocation = (props: Props) => {
   const [isCopied, setIsCopied] = useState(false);

   let pathname = usePathname();
   let dashboardUrl = FILES_URL;
   pathname = withoutLeadingSlash(withoutTrailingSlash(pathname.replace(dashboardUrl, '')));
   const pathArr = pathname && pathname.split('/');

   const onCopy = () => {
      console.log(pathname);
      navigator.clipboard.writeText('Files/' + pathname + '/');
      setIsCopied(true);
      setTimeout(() => {
         setIsCopied(false);
      }, 2 * 1000);
   };

   const getCrumbUrl = (name: string) => {
      dashboardUrl += '/' + name;
      return dashboardUrl;
   };

   return (
      <div className="mb-4 flex w-full items-center justify-between rounded-lg bg-secondary p-3 px-4">
         <Breadcrumb>
            <BreadcrumbList>
               <BreadcrumbItem>
                  <BreadcrumbLink href={dashboardUrl}>Files</BreadcrumbLink>
               </BreadcrumbItem>
               {pathArr &&
                  pathArr.map((name, index) => (
                     <React.Fragment key={index}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                           {index === pathArr.length - 1 ? (
                              <span className="font-semibold">{name}</span>
                           ) : (
                              <BreadcrumbLink href={getCrumbUrl(name)}>{name}</BreadcrumbLink>
                           )}
                        </BreadcrumbItem>
                     </React.Fragment>
                  ))}
            </BreadcrumbList>
         </Breadcrumb>
         <div className="flex items-center gap-3">
            <span className={cn(!isCopied && 'hidden', 'text-xs text-muted-foreground')}>
               Copied
            </span>
            <Button
               variant={'ghost'}
               className="h-3 gap-2 p-0 text-muted-foreground hover:text-primary active:text-muted-foreground"
               onClick={onCopy}
            >
               <Copy className="h-4 w-4" />
            </Button>
         </div>
      </div>
   );
};

export default CurrentFolderLocation;
