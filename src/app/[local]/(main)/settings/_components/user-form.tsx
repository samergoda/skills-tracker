"use client";
import SubmitButton from "@/components/shared/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserAction } from "@/lib/actions/user.action";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function UserForm({ user }: { user: User }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: "",
    },
  });

  const onSubmit = async (data: Pick<User, "firstName" | "lastName" | "email"> & { password: string }) => {
    await updateUserAction(data);
    toast.success("User has been updated");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="">
        <Label className="mb-2" htmlFor="firstName">
          First name
        </Label>
        <Input type="text" {...register("firstName")} id="firstName" />
      </div>
      <div className="">
        <Label className="mb-2" htmlFor="lastName">
          Last name
        </Label>
        <Input type="text" {...register("lastName")} id="lastName" />
      </div>
      <div className="">
        <Label className="mb-2" htmlFor="email">
          Email
        </Label>
        <Input type="email" {...register("email")} id="email" />
      </div>
      <div className="">
        <Label className="mb-2" htmlFor="password">
          Password
        </Label>
        <Input type="password" {...register("password")} id="password" autoComplete="off" />
      </div>
      <SubmitButton text="Submit" disabled={!isValid || isSubmitting} />
    </form>
  );
}
