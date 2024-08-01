import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Layout = ({ children }: { children: React.ReactNode }) => {
   return (
      <main>
         <div className="mb-4 flex items-center justify-between">
            <h1 className="text-4xl font-bold">Trash</h1>
            <Button>Empty Trash</Button>
         </div>

      <div className="mb-4 flex w-full items-center justify-between rounded-lg bg-secondary p-3 px-4 text-muted-foreground text-sm">
         Items in trash will be deleted forever after 30 days.
      </div>
         {children}
      </main>
   );
};

export default Layout;
