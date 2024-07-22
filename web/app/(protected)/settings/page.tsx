import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import React from "react";

type Props = {};

export default async function SettingsPage({}: Props) {
   const session = await auth();
   return (
      <div>
         <pre className="bg-gray-300 border-black border-2 w-[500px] p-4">
            {JSON.stringify(session, null, 3)}
         </pre>
         <form
            action={async () => {
               "use server";
               await signOut({ redirectTo: "/auth/login" });
            }}
         >
            <Button type="submit">Sign out</Button>
         </form>
      </div>
   );
}
