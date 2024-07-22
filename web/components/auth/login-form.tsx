'use client';

import React, { useState, useTransition } from 'react';
import CardWrapper from './card-wrapper';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { LoginSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import FormError from '../form-error';
import FormSuccess from '../form-success';
import { login } from '@/actions/login';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type Props = {};

export default function LoginForm({}: Props) {
   const searchParams = useSearchParams();
   const urlError =
      searchParams.get('error') === 'OAuthAccountNotLinked'
         ? 'Email already in use with different Provider!'
         : '';

   const [showTwoFactor, setShowTwoFactor] = useState(false);
   const [error, setError] = useState<string | undefined>('');
   const [success, setSuccess] = useState<string | undefined>('');
   const [isPending, startTransition] = useTransition();

   const form = useForm<z.infer<typeof LoginSchema>>({
      resolver: zodResolver(LoginSchema),
      defaultValues: {
         email: '',
         password: '',
      },
   });

   function onSubmit(values: z.infer<typeof LoginSchema>) {
      startTransition(() => {
         login(values)
            .then((data: any) => {
               if (data?.twoFactor) {
                  setSuccess('Code sent to you email!');
                  setError('');
                  setShowTwoFactor(true);
                  return;
               }
               if (data?.error || data?.success) form.reset();
               setError(data?.error);
               setSuccess(data?.success);
            })
            .catch(() => setError('Something went wrong!'));
      });
   }

   return (
      <CardWrapper
         headerLabel="Welcome back"
         backButtonLabel="Dont't have an account"
         backButtonHref="/auth/register"
         showSocial
      >
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="flex flex-col justify-start space-y-4"
            >
               {showTwoFactor && (
                  <FormField
                     control={form.control}
                     name="code"
                     render={({ field }) => (
                        <FormItem className="text-left">
                           <FormLabel>Two Factor Code</FormLabel>
                           <FormControl>
                              <Input disabled={isPending} placeholder="000000" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               )}
               {!showTwoFactor && (
                  <>
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
                     <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                           <FormItem className="text-left">
                              <FormLabel>Passoword</FormLabel>
                              <FormControl>
                                 <Input
                                    disabled={isPending}
                                    type="password"
                                    placeholder="******"
                                    {...field}
                                 />
                              </FormControl>
                              <Button
                                 size={'sm'}
                                 variant={'link'}
                                 asChild
                                 className="px-0 font-normal"
                              >
                                 <Link href={'/auth/reset'}>Forgot Password?</Link>
                              </Button>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </>
               )}
               <FormError message={error || urlError} />
               <FormSuccess message={success} />
               <Button type="submit" disabled={isPending}>
                  {showTwoFactor ? 'Submit' : 'Login'}
               </Button>
            </form>
         </Form>
      </CardWrapper>
   );
}
