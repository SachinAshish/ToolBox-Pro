'use client';

import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { FolderSchema } from '@/schemas/files';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../ui/button';
import FormError from '../form-error';
import FormSuccess from '../form-success';
import { useState } from 'react';
import { Input } from '../ui/input';
import { createFolder } from '@/data/files/create';
import { useToast } from '../ui/use-toast';
import { usePathname, useRouter } from 'next/navigation';

type Props = {};

const FolderForm = (props: Props) => {
   const router = useRouter();
   const pathname = usePathname();
   const folderPath = pathname.replace('/dashboard/files', '');
   const { toast } = useToast();
   const [error, setError] = useState<string | undefined>('');
   const [success, setSuccess] = useState<string | undefined>('');

   const form = useForm<z.infer<typeof FolderSchema>>({
      resolver: zodResolver(FolderSchema),
      defaultValues: {
         name: '',
      },
   });

   const onSubmit = async (values: z.infer<typeof FolderSchema>) => {
      const name = values.name;
      const path = folderPath + '/' + name + '/';
      const result = await createFolder(path);

      if (result.success) {
         router.refresh();
         toast({
            title: 'Folder Created Successfully!',
            description: '1 Folder named ' + values.name + ' was created in Your Files.',
         });
         form.reset();
      }

      setError(result.error);
      setSuccess(result.success);
   };

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
               control={form.control}
               name="name"
               render={({ field }) => (
                  <FormItem className="mb-4">
                     <FormLabel>Name</FormLabel>
                     <FormControl>
                        <Input placeholder="Folder" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormSuccess message={success} />
            <FormError message={error} />
            <Button type="submit">Create</Button>
         </form>
      </Form>
   );
};

export default FolderForm;
