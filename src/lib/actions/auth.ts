"use server";
import { cookies } from "next/headers";
import { z } from "zod";
import { redirect } from "next/navigation";
import { loginSchema, signupSchema } from "../schemes/auth.scheme";
import { login, signup } from "../services/auth.service";
import { CustomError } from "../util/customError";

const COOKIE_NAME = process.env.COOKIE_NAME;

if (!COOKIE_NAME) {
  throw new Error("COOKIE_NAME is not defined in environment variables");
}

export const registerUser = async (input: z.infer<typeof signupSchema>) => {
  const data = signupSchema.parse(input);

  try {
    const { token } = await signup(data);
    (await cookies()).set(COOKIE_NAME, token);
  } catch (e) {
    console.error(e);
    return { error: e || "Feiled to sign in" };
  }
  redirect("/dashboard");
};

export const signinUser = async (input: z.infer<typeof loginSchema>) => {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: "Invalid form data" };
  }

  try {
    const { token } = await login(parsed.data);

    (await cookies()).set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    return { success: true };
  } catch (err) {
    if (err instanceof CustomError) {
      return { success: false, error: "Invalid email or password" };
    }

    return { success: false, error: "Unexpected error" };
  }
};
// : Promise<{ success: true } | { success: false; error: string }>
