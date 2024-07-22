"use client";

import React, { useState, useTransition } from "react";
import CardWrapper from "./card-wrapper";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormError from "../form-error";
import FormSuccess from "../form-success";
import { register } from "@/actions/register";

type Props = {};

export default function RegisterForm({}: Props) {
   const [error, setError] = useState<string | undefined>("");
   const [success, setSuccess] = useState<string | undefined>("");
   const [isPending, startTransition] = useTransition();

   const form = useForm<z.infer<typeof RegisterSchema>>({
      resolver: zodResolver(RegisterSchema),
      defaultValues: {
         name: "",
         email: "",
         password: "",
      },
   });

   function onSubmit(values: z.infer<typeof RegisterSchema>) {
      startTransition(() => {
         register(values).then((data: any) => {
            setError(data.error);
            setSuccess(data.success);
         });
      });
   }

   return (
      <CardWrapper
         headerLabel="Create an Account"
         backButtonLabel="Already have an account"
         backButtonHref="/auth/login"
         showSocial
      >
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="space-y-4 flex flex-col justify-start"
            >
               <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                     <FormItem className="text-left">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                           <Input
                              disabled={isPending}
                              placeholder="johndoe"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
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
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormError message={error} />
               <FormSuccess message={success} />
               <Button type="submit" disabled={isPending}>
                  Register
               </Button>
            </form>
         </Form>
      </CardWrapper>
   );
}
