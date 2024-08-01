'use client';

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import React, { useState } from 'react';
import { Button, buttonVariants } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';
import { sidebarButtonType } from '@/types';

type Props = { navs: sidebarButtonType[] };

const SideBar = ({ navs }: Props) => {
   const [open, setOpen] = useState(false);

   const SideBarBtn = ({ icon, title, onClick }: sidebarButtonType) => {
      return (
         <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
               <div className="w-16">
                  <Button
                     size={'icon'}
                     variant={'secondary'}
                     className="flex w-[12.5rem] items-center justify-start gap-3 bg-background hover:bg-secondary"
                     onClick={onClick}
                  >
                     <div className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }))}>
                        {icon}
                     </div>
                     {title}
                  </Button>
               </div>
            </TooltipTrigger>
            {!open && <TooltipContent side="right">{title}</TooltipContent>}
         </Tooltip>
      );
   };

   return (
      <>
         <div
            className={cn(
               open ? 'min-w-56' : 'min-w-16',
               'duration-400 absolute z-40 transition-all lg:static 3xl:absolute',
            )}
         >
            <div
               className={cn(
                  open ? 'w-56' : 'w-16',
                  'duration-400 fixed bottom-0 left-0 h-[calc(100vh-70px)] overflow-hidden border-r bg-background transition-all',
               )}
            >
               <div className="flex h-full flex-col items-end p-2 px-3">
                  <Tooltip delayDuration={100}>
                     <TooltipTrigger asChild>
                        <Button
                           size={'icon'}
                           variant={'secondary'}
                           onClick={() => setOpen((prev) => !prev)}
                        >
                           {open ? (
                              <PanelLeftClose className="h-5 w-5" />
                           ) : (
                              <PanelLeftOpen className="h-5 w-5" />
                           )}
                        </Button>
                     </TooltipTrigger>
                     {!open && (
                        <TooltipContent side="right">
                           <p>Open Side Panel</p>
                        </TooltipContent>
                     )}
                  </Tooltip>
                  <div className="flex h-full w-full flex-col items-start justify-center gap-2 pb-32">
                     {navs.map((nav: sidebarButtonType) => (
                        <SideBarBtn {...nav} key={nav.title} />
                     ))}
                  </div>
               </div>
            </div>
         </div>
         <div className="block w-16 lg:hidden"></div>
      </>
   );
};

export default SideBar;
