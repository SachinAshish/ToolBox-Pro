import { LoginButton } from "@/components/auth/login-btn";
import { Button } from "@/components/ui/button";

export default function Home() {
   return (
      <main className="flex h-full flex-col items-center justify-center bg-sky-500 text-white">
         <div className="space-y-6 flex flex-col items-center">
            <h1 className="text-6xl font-semibold drop-shadow-md">AUTH</h1>
            <p className="text-center text-lg">
               A simple authentication service
            </p>
            <div>
               <LoginButton>
                  <Button variant="secondary" size={"lg"}>
                     Sign in
                  </Button>
               </LoginButton>
            </div>
         </div>
      </main>
   );
}
