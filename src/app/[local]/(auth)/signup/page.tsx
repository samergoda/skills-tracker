"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/lib/actions/auth";
import { authSchema } from "@/lib/schemes/auth.scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export default function page() {
  const [isPending, startTransition] = useTransition();

  //Form
  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //Function
  function onSubmit(data: z.infer<typeof authSchema>) {
    startTransition(async () => {
      await registerUser(data);
    });
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
            <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="Email" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Password</FieldLabel>
            <Input {...field} id={field.name} aria-invalid={fieldState.invalid} type="password" placeholder="Password" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
}
