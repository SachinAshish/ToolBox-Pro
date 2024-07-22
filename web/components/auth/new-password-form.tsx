"use client";

import React, { useState, useTransition } from "react";
import CardWrapper from "./card-wrapper";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { NewPasswordSchema } from "@/schemas";
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
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/new-password";

type Props = {};

export default function NewPasswordForm({}: Props) {
   const searchParams = useSearchParams();
   const token = searchParams.get("token");

   const [error, setError] = useState<string | undefined>("");
   const [success, setSuccess] = useState<string | undefined>("");

   const [isPending, startTransition] = useTransition();

   const form = useForm<z.infer<typeof NewPasswordSchema>>({
      resolver: zodResolver(NewPasswordSchema),
      defaultValues: {
         password: "",
      },
   });

   function onSubmit(values: z.infer<typeof NewPasswordSchema>) {
      startTransition(() => {
         newPassword(values, token).then((data: any) => {
            setError(data?.error);
            setSuccess(data?.success);
         });
      });
   }

   return (
      <CardWrapper
         headerLabel="Enter a new Password"
         backButtonLabel="Back to login"
         backButtonHref="/auth/login"
      >
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="space-y-4 flex flex-col justify-start"
            >
               <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                     <FormItem className="text-left">
                        <FormLabel>Password</FormLabel>
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
                  Reset Password
               </Button>
            </form>
         </Form>
      </CardWrapper>
   );
}
