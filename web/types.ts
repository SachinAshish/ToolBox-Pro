import { MouseEventHandler } from "react";

export type contentType = {
   name: string;
   type: string | false;
   path: string;
};

export type sidebarButtonType = {
   icon: React.ReactNode;
   title: string;
   onClick: MouseEventHandler<HTMLButtonElement>;
};
