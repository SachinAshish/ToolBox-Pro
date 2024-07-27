'use client';
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import React from 'react';

type Props = {};

const CurrentFolderLocation = (props: Props) => {
   let pathname = usePathname();
   let dashboardUrl = '/dashboard/files';
   pathname = pathname.replace(dashboardUrl, '');
   pathname = pathname.endsWith('/') ? pathname.substring(0, pathname.length - 1) : pathname;
   pathname = pathname.startsWith('/') ? pathname.substring(1) : pathname;
   const pathArr = pathname && pathname.split('/');

   const getCrumbUrl = (name: string) => {
      dashboardUrl += '/' + name;
      return dashboardUrl;
   };
   return (
      <div className="mb-4 w-full rounded-lg bg-secondary p-3">
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
                              <span className="font-semibold">{name.replaceAll('%20', ' ')}</span>
                           ) : (
                              <BreadcrumbLink href={getCrumbUrl(name)}>
                                 {name.replaceAll('%20', ' ')}
                              </BreadcrumbLink>
                           )}
                        </BreadcrumbItem>
                     </React.Fragment>
                  ))}
            </BreadcrumbList>
         </Breadcrumb>
      </div>
   );
};

export default CurrentFolderLocation;
