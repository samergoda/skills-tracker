import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest } from "next/server";
import "dotenv/config";

const intlMiddleware = createMiddleware(routing);

const COOKIE_NAME = process.env.COOKIE_NAME;

if (!COOKIE_NAME) {
  throw new Error("COOKIE_NAME is not defined in environment variables");
}

const publicPages = ["/login", "/signup"];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME || "pardy-token");

  const publicPathnameRegex = RegExp(
    `^(/(${routing.locales.join("|")}))?(${publicPages.flatMap((p) => (p === "/" ? ["", "/"] : p)).join("|")})/?$`,
    "i",
  );

  const isPublicPage = publicPathnameRegex.test(pathname);

  // Extract locale from URL
  const localeMatch = pathname.match(new RegExp(`^/(${routing.locales.join("|")})`));

  const locale = localeMatch?.[1] ?? routing.defaultLocale;

  if (!token && !isPublicPage) {
    return Response.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (token && isPublicPage) {
    return Response.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
