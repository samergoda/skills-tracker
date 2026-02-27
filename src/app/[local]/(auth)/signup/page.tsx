"use client";

import SubmitButton from "@/components/shared/SubmitButton";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { registerUser } from "@/lib/actions/auth";
import { authSchema } from "@/lib/schemes/auth.scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setError,
  } = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof authSchema>) => {
    const result = await registerUser(data);

    if (result?.error) {
      setError("root", result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Sign up</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field data-invalid={!!errors.firstName}>
            <FieldLabel htmlFor="firstName">firstName</FieldLabel>
            <Input id="first-name" type="text" placeholder="john" autoFocus {...register("firstName")} aria-invalid={!!errors.firstName} />
            {errors.firstName && <FieldError errors={[errors.firstName]} />}
          </Field>
          <Field data-invalid={!!errors.lastName}>
            <FieldLabel htmlFor="lastName">lastName</FieldLabel>
            <Input id="last-name" type="text" placeholder="doe" autoFocus {...register("lastName")} aria-invalid={!!errors.lastName} />
            {errors.lastName && <FieldError errors={[errors.lastName]} />}
          </Field>
          {/* Email */}
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" placeholder="you@example.com" autoFocus {...register("email")} aria-invalid={!!errors.email} />
            {errors.email && <FieldError errors={[errors.email]} />}
          </Field>

          {/* Password */}
          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input id="password" type="password" placeholder="••••••••" {...register("password")} aria-invalid={!!errors.password} />
            {errors.password && <FieldError errors={[errors.password]} />}
          </Field>

          {/* Server error */}
          {errors.root && <p className="text-sm text-red-500">{errors.root.message}</p>}

          <SubmitButton text={isSubmitting ? "Sign up..." : "Sign up"} disabled={!isValid || isSubmitting} />
        </form>
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-sm text-muted-foreground">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
