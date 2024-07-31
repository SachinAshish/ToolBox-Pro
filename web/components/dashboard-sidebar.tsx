'use client';

import { sidebarButtonType } from '@/types';
import { FileIcon, Star, Trash } from 'lucide-react';
import SideBar from './sidebar';
import { FILES_URL, TRASH_URL } from '@/routes';
import { useRouter } from 'next/navigation';

type Props = {};

const DashboardSideBar = (props: Props) => {
   const router = useRouter();
   const sideBarNavs: sidebarButtonType[] = [
      {
         icon: <FileIcon className="h-5 w-5" />,
         title: 'Files',
         onClick: () => router.push(FILES_URL),
      },
      {
         icon: <Trash className="h-5 w-5" />,
         title: 'Trash',
         onClick: () => router.push(TRASH_URL),
      },
   ];
   return <SideBar navs={sideBarNavs} />;
};

export default DashboardSideBar;
