'use client';

import { sidebarButtonType } from '@/types';
import {
   Bot,
   Files,
   FileText,
   LayoutTemplate,
   NotebookPen,
   PocketKnife,
   Star,
   Trash2,
   Waypoints,
} from 'lucide-react';
import SideBar from './sidebar';
import { FILES_URL, STARRED_URL, TRASH_URL } from '@/routes';
import { useRouter } from 'next/navigation';

type Props = {};

const DashboardSideBar = (props: Props) => {
   const router = useRouter();

   let iconClassName = 'h-5 w-5';

   const sideBarNavs: sidebarButtonType[] = [
      {
         icon: <Files className={iconClassName} />,
         title: 'Files',
         onClick: () => router.push(FILES_URL),
      },
      {
         icon: <Star className={iconClassName} />,
         title: 'Starred',
         onClick: () => router.push(STARRED_URL),
      },
      {
         icon: <NotebookPen className={iconClassName} />,
         title: 'Notes',
         onClick: () => {},
      },
      {
         icon: <Waypoints className={iconClassName} />,
         title: 'Automations',
         onClick: () => {},
      },
      {
         icon: <FileText className={iconClassName} />,
         title: 'Forms',
         onClick: () => {},
      },
      {
         icon: <LayoutTemplate className={iconClassName} />,
         title: 'Webpages',
         onClick: () => {},
      },
      {
         icon: <PocketKnife className={iconClassName} />,
         title: 'Common Tools',
         onClick: () => {},
      },
      {
         icon: <Bot className={iconClassName} />,
         title: 'Ai Tools',
         onClick: () => {},
      },
      {
         icon: <Trash2 className={iconClassName} />,
         title: 'Trash',
         onClick: () => router.push(TRASH_URL),
      },
   ];
   return <SideBar navs={sideBarNavs} />;
};

export default DashboardSideBar;
