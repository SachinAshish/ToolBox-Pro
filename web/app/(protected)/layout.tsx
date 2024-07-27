import { Toaster } from '@/components/ui/toaster';

type Props = {
   children: React.ReactNode;
};

const ProtectedPageLayout = ({ children }: Props) => {
   return (
      <div>
         {children}
         <Toaster />
      </div>
   );
};

export default ProtectedPageLayout;
