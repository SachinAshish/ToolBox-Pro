import { cn } from "@/lib/utils";
import React from "react";

type Props = {
   label: string;
};

export function HeaderLabel({ label }: Props) {
   return (
      <div className="w-full flex flex-col gap-y-4 items-center justify-center">
         <h1 className={cn("text-3xl font-semibold")}>Auth</h1>
         <p className="text-muted-foreground">{label}</p>
      </div>
   );
}
