import Link from 'next/link';
import React from 'react';
import { UserButton } from './user-button';
import { currentUser } from '@/lib/auth/auth';
import { Button } from './ui/button';

type Props = {};

const Navbar = async (props: Props) => {
   const user = await currentUser();
   return (
      <div className="flex h-[100px] w-full items-center bg-gray-50 px-8">
         <div className="flex w-full items-center justify-between">
            <span>
               <Link href="/" className="hover:underline">
                  <Button variant={"link"}>Home</Button>
               </Link>
            </span>
            {user && (
               <span>
                  <UserButton />
               </span>
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
         </div>
      </div>
   );
};

export default Navbar;
