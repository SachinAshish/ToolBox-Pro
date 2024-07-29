'use client';

import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { RenameFileSchema } from '@/schemas/files';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../ui/button';
import FormError from '../form-error';
import FormSuccess from '../form-success';
import { useState } from 'react';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';
import { getFileName, withoutTrailingSlash } from '@/lib/utils';
import { useCurrentUser } from '@/hooks/use-current-user';
import { renameFolder } from '@/data/files/rename';

type Props = {
   folderPath: string;
   close: Function;
};

const RenameFolderForm = ({ folderPath, close }: Props) => {
   const user = useCurrentUser();
   const router = useRouter();

   const folderName = getFileName(withoutTrailingSlash(folderPath));

   const { toast } = useToast();
   const [error, setError] = useState<string | undefined>('');
   const [success, setSuccess] = useState<string | undefined>('');

   const form = useForm<z.infer<typeof RenameFileSchema>>({
      resolver: zodResolver(RenameFileSchema),
      defaultValues: {
         name: folderName,
      },
   });

   const onSubmit = async (values: z.infer<typeof RenameFileSchema>) => {
      if (!user) return;

      const { name } = values;

      const result = await renameFolder(folderPath, name);

      if (result.success) {
         router.refresh();
         toast({
            title: result.success,
            description: 'The folder ' + folderName + ' was renamed to ' + name + ' succeccfully',
         });
         form.reset();
         close();
      }
      setError(result.error);
   };

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
               control={form.control}
               name="name"
               render={({ field }) => (
                  <FormItem className="mb-4">
                     <FormLabel>File name</FormLabel>
                     <FormControl>
                        <Input spellCheck={false} placeholder={folderName} {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormSuccess message={success} />
            <FormError message={error} />
            <Button type="submit">Rename</Button>
         </form>
      </Form>
   );
};

export default RenameFolderForm;
