import React from "react";
import { FaCheckCircle } from "react-icons/fa";

type Props = {
   message?: string;
};

export default function FormSuccess({ message }: Props) {
   if (!message) return null;
   return (
      <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
         <FaCheckCircle />
         <p>{message}</p>
      </div>
   );
}
