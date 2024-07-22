import * as z from "zod";

export const LoginSchema = z.object({
   email: z.string().email(),
   password: z.string().min(1, {
      message: "Password is required",
   }),
   code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
   name: z.string().min(1),
   email: z.string().email(),
   password: z.string().min(6, {
      message: "minimum 6 characters required",
   }),
});

export const ResetPasswordSchema = z.object({
   email: z.string().email({
      message: "Email is Required",
   }),
});

export const NewPasswordSchema = z.object({
   password: z.string().min(6, {
      message: "Minimum 6 charaters required",
   }),
});
