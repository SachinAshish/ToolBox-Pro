'use client';
import { useCurrentUser } from '@/hooks/use-current-user';

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { LogoutButton } from '@/components/auth/logout-button';
import Link from 'next/link';
import { CreditCard, LogOut, Settings, User, File, LayoutDashboard } from 'lucide-react';

export const UserButton = () => {
   const user = useCurrentUser();

   return (
      <DropdownMenu>
         <DropdownMenuTrigger className="focus:outline-none">
            <Avatar>
               <AvatarImage src={user?.image || undefined} />
               <AvatarFallback className="bg-neutral-700 text-white">
                  <User />
               </AvatarFallback>
            </Avatar>
         </DropdownMenuTrigger>
         <DropdownMenuContent className="w-40" align="end">
            <DropdownMenuItem>
               <Link href={'/dashboard'} className="flex">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
               </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
               <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
               </DropdownMenuItem>
               <DropdownMenuItem>
                  <Link href={'/dashboard/files'} className="flex">
                     <File className="mr-2 h-4 w-4" />
                     Files
                  </Link>
               </DropdownMenuItem>
               <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               <LogoutButton>
                  <DropdownMenuItem className="text-destructive">
                     <LogOut className="mr-2 h-4 w-4" />
                     Logout
                  </DropdownMenuItem>
               </LogoutButton>
            </DropdownMenuGroup>
         </DropdownMenuContent>
      </DropdownMenu>
   );
};
