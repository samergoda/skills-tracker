"use client";

import SubmitButton from "@/components/shared/SubmitButton";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { signinUser } from "@/lib/actions/auth";
import { loginSchema } from "@/lib/schemes/auth.scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setError,
    reset,
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    const result = await signinUser(data);
    if (!result.success) {
      setError("root", { message: result.error });
      return;
    }
    toast.success(t("loginSuccess"));
    reset();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">{t("login")}</h1>
          <p className="text-sm text-muted-foreground">{t("enterCredentials")}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              autoFocus
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && <FieldError errors={[errors.email]} />}
          </Field>

          {/* Password */}
          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder={t("passwordPlaceholder")}
              {...register("password")}
              aria-invalid={!!errors.password}
            />
            {errors.password && <FieldError errors={[errors.password]} />}
          </Field>

          {/* Server error */}
          {errors.root && <p className="text-sm text-red-500">{errors.root.message}</p>}

          <SubmitButton text={isSubmitting ? t("loggingIn") : t("login")} disabled={!isValid || isSubmitting} />
        </form>
        <p className="text-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <Link href="/signup" className="text-sm text-muted-foreground">
            {t("signup")}
          </Link>
        </p>
      </div>
    </div>
  );
}
