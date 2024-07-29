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
import { getFileExtension, getFileName } from '@/lib/utils';
import { useCurrentUser } from '@/hooks/use-current-user';
import { renameFile } from '@/data/files/rename';

type Props = {
   filePath: string;
   close: Function;
};

const RenameFileForm = ({ filePath, close }: Props) => {
   const user = useCurrentUser();
   const router = useRouter();

   const fileName = getFileName(filePath);

   const { toast } = useToast();
   const [error, setError] = useState<string | undefined>('');
   const [success, setSuccess] = useState<string | undefined>('');

   const form = useForm<z.infer<typeof RenameFileSchema>>({
      resolver: zodResolver(RenameFileSchema),
      defaultValues: {
         name: fileName,
      },
   });

   const onSubmit = async (values: z.infer<typeof RenameFileSchema>) => {
      if (!user) return;

      const { name } = values;

      if (getFileExtension(name) !== getFileExtension(fileName)) {
         setError(
            'The extension of the file should be the same as the extension of the previous file (' +
               getFileExtension(fileName) +
               ' in this case)',
         );
         return;
      }

      const result = await renameFile(filePath, name);

      if (result.success) {
         router.refresh();
         toast({
            title: result.success,
            description: 'The file ' + fileName + ' was renamed to ' + name + ' succeccfully',
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
               name="name"
               render={({ field }) => (
                  <FormItem className="mb-4">
                     <FormLabel>File name</FormLabel>
                     <FormControl>
                        <Input spellCheck={false} placeholder={fileName} {...field} />
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

export default RenameFileForm;
