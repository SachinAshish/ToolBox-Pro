import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';

type Props = {
   href: string;
   label: string;
};

export default function BackButton({ href, label }: Props) {
   return (
      <Button variant={'link'} className="w-full font-normal" size="sm" asChild>
         <Link href={href}>{label}</Link>
      </Button>
   );
}
