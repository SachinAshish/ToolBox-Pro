import EmptyTrashButton from '@/components/files/trash/empty-trash';

const Layout = async ({ children }: { children: React.ReactNode }) => {
   return (
      <main>
         <div className="mb-4 flex items-center justify-between">
            <h1 className="text-4xl font-bold">Trash</h1>
            <EmptyTrashButton />
         </div>

         <div className="mb-4 flex w-full items-center justify-between rounded-lg bg-secondary p-3 px-4 text-sm text-muted-foreground">
            Items in trash will be deleted forever after 30 days.
         </div>
         {children}
      </main>
   );
};

export default Layout;
