'use client';

import React, { useState, useTransition } from 'react';
import CardWrapper from './card-wrapper';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ResetPasswordSchema } from '@/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import FormError from '../form-error';
import FormSuccess from '../form-success';
import { reset } from '@/actions/auth/reset';

type Props = {};

export default function ResetForm({}: Props) {
   const [error, setError] = useState<string | undefined>('');
   const [success, setSuccess] = useState<string | undefined>('');

   const [isPending, startTransition] = useTransition();

   const form = useForm<z.infer<typeof ResetPasswordSchema>>({
      resolver: zodResolver(ResetPasswordSchema),
      defaultValues: {
         email: '',
      },
   });

   function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
      startTransition(() => {
         reset(values).then((data: any) => {
            setError(data?.error);
            setSuccess(data?.success);
         });
      });
   }

   return (
      <CardWrapper
         headerLabel="Forgot your Password?"
         backButtonLabel="Back to login"
         backButtonHref="/auth/login"
      >
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="flex flex-col justify-start space-y-4"
            >
               <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                     <FormItem className="text-left">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                           <Input
                              disabled={isPending}
                              placeholder="johndoe@example.com"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormError message={error} />
               <FormSuccess message={success} />
               <Button type="submit" disabled={isPending}>
                  Send Reset Email
               </Button>
            </form>
         </Form>
      </CardWrapper>
   );
}
