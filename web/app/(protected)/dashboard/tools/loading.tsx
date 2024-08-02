import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CardLoader = () => {
   return (
      <Card className="group flex h-full w-full cursor-pointer flex-col overflow-hidden bg-background p-0">
         <CardHeader className="w-full p-5">
            <CardTitle className="flex max-w-full items-start justify-between">
               <Skeleton className="h-16 w-full" />
            </CardTitle>
         </CardHeader>
         <CardContent className="h-full w-full p-5 pt-0">
            <Skeleton className="aspect-[13/9] h-full w-full"></Skeleton>
         </CardContent>
      </Card>
   );
};

type Props = {};

const Loading = (props: Props) => {
   return (
      <div className="h-full w-full">
         <Skeleton className="mb-4 h-8 w-full" />
         <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
            <Skeleton className="h-16 w-full border" />
            <Skeleton className="h-16 w-full border" />
            <Skeleton className="h-16 w-full border" />
            <Skeleton className="h-16 w-full border" />
            <Skeleton className="h-16 w-full border" />
            <Skeleton className="h-16 w-full border" />
         </div>
         <Skeleton className="mb-4 h-8 w-full" />
         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
            <CardLoader />
            <CardLoader />
            <CardLoader />
            <CardLoader />
            <CardLoader />
            <CardLoader />
            <CardLoader />
            <CardLoader />
         </div>
      </div>
   );
};

export default Loading;
