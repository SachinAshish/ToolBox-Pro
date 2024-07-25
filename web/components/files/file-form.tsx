'use client';

import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { FileSchema } from '@/schemas/files';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Loader2, Paperclip, Upload } from 'lucide-react';
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from '../ui/file-input';
import { DropzoneOptions } from 'react-dropzone';
import FormError from '../form-error';
import FormSuccess from '../form-success';
import { useState, useTransition } from 'react';
import { uploadFile } from '@/data/files/create';
import { useToast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';

type Props = {};

const FileForm = (props: Props) => {
   const router = useRouter();
   const [error, setError] = useState<string | undefined>('');
   const [success, setSuccess] = useState<string | undefined>('');
   const [isPending, startTransition] = useTransition();
   const { toast } = useToast();

   const form = useForm<z.infer<typeof FileSchema>>({
      resolver: zodResolver(FileSchema),
      defaultValues: {
         files: null,
      },
   });

   const uploadFiles = async (files: File[]) => {
      let error: string[] = [];
      const inputFiles = [...files];
      let formFiles = [...inputFiles];

      for (const file of inputFiles) {
         const formData = new FormData();
         formData.append('file', file, file.name);

         const result = await uploadFile(formData);

         if (result.success) {
            formFiles = formFiles.filter((f) => f.name !== file.name);
            form.setValue('files', formFiles || []);
         }
         if (result.error) {
            error.push('<b>' + file.name + ': </b>' + result.error);
         }
      }

      if (error.length === 0) {
         setError('');
         setSuccess('Files uploaded successfully!');
      } else {
         setSuccess('');
         setError(error.join('<br/>'));
      }

      const addedFiles = inputFiles.length - formFiles.length;
      if (addedFiles === 0) return;
      toast({
         title: 'Files Uploaded Successfully!',
         description:
            addedFiles > 1
               ? addedFiles + ' files were added in Your Files.'
               : '1 file was added in Your Files',
      });
   };

   const onSubmit = async (values: z.infer<typeof FileSchema>) => {
      startTransition(async () => {
         if (values.files) {
            await uploadFiles(values.files);
            router.refresh();
         } else {
            setSuccess('');
            setError('Could not find the files! Put them in the intended place.');
         }
      });
   };

   const dropzone = {
      multiple: true,
      maxFiles: 10,
   } satisfies DropzoneOptions;

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
               control={form.control}
               name="files"
               render={({ field }) => (
                  <FormItem className="mb-4">
                     <FileUploader
                        value={field.value}
                        onValueChange={(value) => {
                           field.onChange(value);
                        }}
                        dropzoneOptions={dropzone}
                     >
                        <FileInput className="border-2 border-dashed border-black">
                           <div className="flex w-full flex-col items-center justify-center py-16">
                              <Upload className="mb-4 h-8 w-8" />
                              <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                 <span className="font-semibold">Click to upload</span>
                                 &nbsp; or drag and drop
                              </p>
                           </div>
                        </FileInput>
                        {field.value && field.value.length > 0 && (
                           <FileUploaderContent>
                              {field.value.map((file, i) => (
                                 <FileUploaderItem
                                    key={i}
                                    index={i}
                                    className="m-0 h-full w-full border p-0"
                                 >
                                    <Paperclip className="h-4 w-4 stroke-current" />
                                    <span>{file.name}</span>
                                 </FileUploaderItem>
                              ))}
                           </FileUploaderContent>
                        )}
                     </FileUploader>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormSuccess message={success} />
            <FormError message={error} />
            <Button type="submit" disabled={isPending}>
               {isPending ? (
                  <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading
                  </>
               ) : (
                  'Upload'
               )}
            </Button>
         </form>
      </Form>
   );
};

export default FileForm;
