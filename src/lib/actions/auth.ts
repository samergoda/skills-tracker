"use server";
import { cookies } from "next/headers";
import { z } from "zod";
import { redirect } from "next/navigation";
import { authSchema } from "../schemes/auth.scheme";
import { signin, signup } from "../services/auth.service";

const COOKIE_NAME = process.env.COOKIE_NAME;

if (!COOKIE_NAME) {
  throw new Error("COOKIE_NAME is not defined in environment variables");
}

export const registerUser = async (input: z.infer<typeof authSchema>) => {
  const data = authSchema.parse(input);

  try {
    const { token } = await signup(data);
    (await cookies()).set(COOKIE_NAME, token);
  } catch (e) {
    console.error(e);
    return { error: e || "Feiled to sign in" };
  }
  redirect("/dashboard");
};

export const signinUser = async (input: z.infer<typeof authSchema>) => {
  const data = authSchema.parse(input);

  try {
    const { token } = await signin(data);
    (await cookies()).set(COOKIE_NAME, token);
  } catch (e) {
    console.error(e);
    return { error: e || "Feiled to sign in" };
  }
  redirect("/dashboard");
};
