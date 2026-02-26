"use client";

import SubmitButton from "@/components/shared/SubmitButton";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { signinUser } from "@/lib/actions/auth";
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
    },
  });

  const onSubmit = async (data: z.infer<typeof authSchema>) => {
    const result = await signinUser(data);

    if (result?.error) {
      setError("root", result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <SubmitButton text={isSubmitting ? "Logging in..." : "Login"} disabled={!isValid || isSubmitting} />
        </form>
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="text-sm text-muted-foreground">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
