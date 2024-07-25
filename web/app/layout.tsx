import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import Navbar from '@/components/navbar';

const font = Poppins({
   subsets: ['latin'],
   display: 'swap',
   variable: '--font-poppins',
   weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
   title: 'ToolBox-Pro',
   description: 'Generated by create next app',
};

export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const session = await auth();
   return (
      <SessionProvider session={session}>
         <html lang="en">
            <body className={font.className}>
               <Navbar />
               {children}
            </body>
         </html>
      </SessionProvider>
   );
}
