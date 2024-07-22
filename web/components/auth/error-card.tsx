import React from "react";
import { Card, CardFooter, CardHeader } from "../ui/card";
import { HeaderLabel } from "./header";
import BackButton from "./back-button";

type Props = {};

const ErrorCard = (props: Props) => {
   return (
      <Card className="w-[400px] shadow-md">
         <CardHeader>
            <HeaderLabel label="Oops! Something went wrong!" />
         </CardHeader>
         <CardFooter>
            <BackButton label="Back to login" href="/auth/login" />
         </CardFooter>
      </Card>
   );
};

export default ErrorCard;
