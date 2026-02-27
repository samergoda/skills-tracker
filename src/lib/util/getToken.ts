import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = process.env.COOKIE_NAME;

if (!COOKIE_NAME) {
  throw new Error("COOKIE_NAME is not defined in environment variables");
}

export const getToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  // If not token redirect to login
  if (!token) return redirect("/login");

  return token;
};
