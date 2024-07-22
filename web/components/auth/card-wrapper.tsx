import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { HeaderLabel } from "./header";
import { Social } from "./social";
import BackButton from "./back-button";

type Props = {
   children: React.ReactNode;
   headerLabel: string;
   backButtonLabel: string;
   backButtonHref: string;
   showSocial?: boolean;
};

export default function CardWrapper({
   children,
   headerLabel,
   backButtonLabel,
   backButtonHref,
   showSocial,
}: Props) {
   return (
      <Card className="w-[400px] shadow-md">
         <CardHeader>
            <HeaderLabel label={headerLabel}></HeaderLabel>
         </CardHeader>
         <CardContent>{children}</CardContent>
         {showSocial && (
            <CardFooter>
               <Social />
            </CardFooter>
         )}
         <CardFooter>
            <BackButton href={backButtonHref} label={backButtonLabel} />
         </CardFooter>
      </Card>
   );
}
