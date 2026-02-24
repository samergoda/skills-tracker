"use server";
import { cookies } from "next/headers";
import { signin, signup } from "../util/authTools";
import { z } from "zod";
import { redirect } from "next/navigation";
import { authSchema } from "../schemes/auth.scheme";
import "dotenv/config";

const COOKIE_NAME = process.env.COOKIE_NAME;

if (!COOKIE_NAME) {
  throw new Error("COOKIE_NAME is not defined in environment variables");
}

export const registerUser = async (input: FormData | z.infer<typeof authSchema>) => {
  const data = input instanceof FormData ? authSchema.parse(Object.fromEntries(input.entries())) : authSchema.parse(input);

  try {
    const { token } = await signup(data);
    (await cookies()).set(COOKIE_NAME, token);
  } catch (e) {
    console.error(e);
    throw new Error("Failed to sign in");
  }
  redirect("/dashboard");
};

export const signinUser = async (input: FormData | z.infer<typeof authSchema>) => {
  const data = input instanceof FormData ? authSchema.parse(Object.fromEntries(input.entries())) : authSchema.parse(input);

  try {
    const res = await signin(data);
    console.log("ress", res);
    (await cookies()).set(COOKIE_NAME, res.token);
  } catch (e) {
    console.error(e);
    throw new Error("Failed to sign in");
  }
  redirect("/dashboard");
};
