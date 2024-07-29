'use client';

import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { MoveFileSchema } from '@/schemas/files';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../ui/button';
import FormError from '../form-error';
import FormSuccess from '../form-success';
import { useState } from 'react';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';
import { useRouter, usePathname } from 'next/navigation';
import { getFileName } from '@/lib/utils';
import { useCurrentUser } from '@/hooks/use-current-user';
import { moveFile } from '@/data/files/move';

type Props = {
   filePath: string;
   close: Function;
};

const MoveFileForm = ({ filePath, close }: Props) => {
   const user = useCurrentUser();
   const router = useRouter();
   const pathname = usePathname();
   const folderPath = pathname.replace('/dashboard/files', '');
   const fileName = getFileName(filePath);
   const { toast } = useToast();
   const [error, setError] = useState<string | undefined>('');
   const [success, setSuccess] = useState<string | undefined>('');

   const form = useForm<z.infer<typeof MoveFileSchema>>({
      resolver: zodResolver(MoveFileSchema),
      defaultValues: {
         path: 'Files' + folderPath + '/',
      },
   });

   const onSubmit = async (values: z.infer<typeof MoveFileSchema>) => {
      if (!user) return;

      let { path } = values;
      path = path.replace('Files/', user.id + '/drive/');

      const result = await moveFile(filePath, path);

      if (result.success) {
         router.refresh();
         toast({
            title: result.success,
            description: 'The ' + fileName + ' was moved to ' + path + ' successfully.',
         });
         form.reset();
         close();
      }
      setError(result.error);
      setSuccess(result.success);
   };

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
               control={form.control}
               name="path"
               render={({ field }) => (
                  <FormItem className="mb-4">
                     <FormLabel>Folder</FormLabel>
                     <FormControl>
                        <Input
                           spellCheck={false}
                           placeholder="Folder"
                           {...field}
                           onChange={(e) => {
                              let value = e.target.value;
                              value = value.startsWith('Files/') ? value : 'Files/' + value;
                              e.target.value = value.replaceAll('//', '/');
                              field.onChange(e);
                           }}
                        />
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

export default MoveFileForm;
