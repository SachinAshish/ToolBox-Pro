'use client';

import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { CopyFileSchema } from '@/schemas/files';
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
import { copyFile } from '@/data/files/copy';
import { getFileExtension, getFileName } from '@/lib/utils';
import { useCurrentUser } from '@/hooks/use-current-user';

type Props = {
   filePath: string;
   close: Function;
};

const CopyFileForm = ({ filePath, close }: Props) => {
   const user = useCurrentUser();
   const router = useRouter();
   const pathname = usePathname();
   const folderPath = pathname.replace('/dashboard/files', '');
   const fileName = getFileName(filePath);
   const { toast } = useToast();
   const [error, setError] = useState<string | undefined>('');
   const [success, setSuccess] = useState<string | undefined>('');

   const form = useForm<z.infer<typeof CopyFileSchema>>({
      resolver: zodResolver(CopyFileSchema),
      defaultValues: {
         path: 'Files' + folderPath + '/',
         name: fileName,
      },
   });

   const onSubmit = async (values: z.infer<typeof CopyFileSchema>) => {
      if (!user) return;

      let { path, name } = values;
      path = path.replace('Files/', user.id + '/drive/');

      if (name && getFileExtension(name) !== getFileExtension(filePath)) {
         setError(
            'The extension of the file should be the same as the extension of the previous file (' +
               getFileExtension(filePath) +
               ' in this case)',
         );
         return;
      }

      const result = await copyFile(filePath, path + name);

      if (result.success) {
         router.refresh();
         toast({
            title: result.success,
            description:
               'A copy of the file ' + fileName + ' is created successfully at the specified path',
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
            <FormField
               control={form.control}
               name="name"
               render={({ field }) => (
                  <FormItem className="mb-4">
                     <FormLabel>File name {`(Optional)`}</FormLabel>
                     <FormControl>
                        <Input spellCheck={false} placeholder={fileName} {...field} />
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

export default CopyFileForm;
