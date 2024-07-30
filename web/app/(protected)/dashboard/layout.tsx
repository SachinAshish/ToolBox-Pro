import DashboardSideBar from '@/components/dashboard-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

type Props = {
   children: React.ReactNode;
};

const ProtectedPageLayout = ({ children }: Props) => {
   return (
      <TooltipProvider>
         <div className="flex xl:gap-6">
            <DashboardSideBar />
            {children}
         </div>
         <Toaster />
      </TooltipProvider>
   );
};

export default ProtectedPageLayout;
