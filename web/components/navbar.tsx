import Link from 'next/link';
import React from 'react';
import { UserButton } from './user-button';
import { currentUser } from '@/lib/auth/auth';
import { Button } from './ui/button';
import { ModeToggle } from './mode-toggle';

type Props = {};

const Navbar = async (props: Props) => {
   const user = await currentUser();
   return (
      <div className="flex h-[80px] w-full items-center bg-secondary px-8">
         <div className="flex w-full items-center justify-between">
            <span>
               <Link href="/" className="hover:underline">
                  <Button variant={'link'}>Home</Button>
               </Link>
            </span>
            <div className="flex gap-3 items-center">
               {user && (
                     <UserButton />
               )}
               {!user && (
                  <span>
                     <Link
                        href="/auth/login"
                        className="border-2 border-black p-2 font-semibold hover:underline"
                     >
                        Get started
                     </Link>
                  </span>
               )}
               <ModeToggle />
            </div>
         </div>
      </div>
   );
};

export default Navbar;
