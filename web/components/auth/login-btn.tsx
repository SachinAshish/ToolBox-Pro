"use client";

import { useRouter } from "next/navigation";

interface Props {
   children: React.ReactNode;
   mode?: "modal" | "redirect";
   asChild?: boolean;
}

export const LoginButton = ({
   children,
   mode = "redirect",
   asChild,
}: Props) => {
   const router = useRouter();

   const onClick = () => {
      router.push("/auth/login");
   };

   if (mode === "modal") {
      return <span>Todo: Implement modal</span>;
   }

   return (
      <span className="curson-pointer" onClick={onClick}>
         {children}
      </span>
   );
};
