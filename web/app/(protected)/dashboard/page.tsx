import { signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import { currentUser } from '@/lib/auth/auth';

type Props = {};

const DashboardPage = async (props: Props) => {
   const session = await currentUser();
   return (
      <div>
         <h1>This is the dashboard page</h1>
         <pre className="w-[500px] border-2 border-black bg-gray-300 p-4">
            {JSON.stringify(session, null, 3)}
         </pre>
         <form
            action={async () => {
               'use server';
               await signOut();
            }}
         >
            <Button type="submit">Sign out</Button>
         </form>
      </div>
   );
};

export default DashboardPage;
