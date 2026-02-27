"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = process.env.COOKIE_NAME;

if (!COOKIE_NAME) {
  throw new Error("COOKIE_NAME is not defined in environment variables");
}

export const signout = async () => {
  (await cookies()).delete(COOKIE_NAME);
  redirect("/login");
};
