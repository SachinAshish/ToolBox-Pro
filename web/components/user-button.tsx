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
import { FILES_URL } from '@/routes';

export const UserButton = () => {
   const user = useCurrentUser();

   return (
      <DropdownMenu>
         <DropdownMenuTrigger className="focus:outline-none">
            <Avatar className="border rounded-lg">
               <AvatarImage src={user?.image || undefined} />
               <AvatarFallback className="bg-neutral-700 text-white rounded-lg">
                  <User />
               </AvatarFallback>
            </Avatar>
         </DropdownMenuTrigger>
         <DropdownMenuContent className="w-60" align="end">
            <DropdownMenuItem>
               <User className="mr-2 h-4 w-4" />
               Profile
            </DropdownMenuItem>
            <Link href={'/dashboard'}>
               <DropdownMenuItem>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
               </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
               <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
               </DropdownMenuItem>
               <Link href={FILES_URL}>
                  <DropdownMenuItem>
                     <File className="mr-2 h-4 w-4" />
                     Files
                  </DropdownMenuItem>
               </Link>
               <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               <LogoutButton>
                  <DropdownMenuItem className="text-destructive dark:text-red-500">
                     <LogOut className="mr-2 h-4 w-4" />
                     Logout
                  </DropdownMenuItem>
               </LogoutButton>
            </DropdownMenuGroup>
         </DropdownMenuContent>
      </DropdownMenu>
   );
};
