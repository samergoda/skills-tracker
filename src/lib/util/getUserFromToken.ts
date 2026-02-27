import { getLocale } from "next-intl/server";
import { getToken } from "./getToken";
import { redirect } from "@/i18n/navigation";

export async function getUserFromToken() {
  // Get user from token
  const user = await getUserFromToken(token);

  if (!user?.id) return redirect({ href: "/login", locale });
}
