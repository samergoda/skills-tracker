import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const intlMiddleware = createMiddleware(routing);

const publicPages = ["/login", "/signup"];

export default async function proxy(request: NextRequest) {
  const JWT_SECRET = process.env.SECRET;
  const COOKIE_NAME = process.env.COOKIE_NAME;

  // Check if env variables are defined
  if (!JWT_SECRET || !COOKIE_NAME) {
    throw new Error("Missing env variables");
  }

  const SECRET = new TextEncoder().encode(JWT_SECRET);

  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME);

  const publicPathnameRegex = RegExp(
    `^(/(${routing.locales.join("|")}))?(${publicPages.flatMap((p) => (p === "/" ? ["", "/"] : p)).join("|")})/?$`,
    "i",
  );

  const isPublicPage = publicPathnameRegex.test(pathname);
  // Extract locale from URL
  const localeMatch = pathname.match(new RegExp(`^/(${routing.locales.join("|")})`));

  const locale = localeMatch?.[1] ?? routing.defaultLocale;

  // 1. No token and not a public page → redirect to login
  if (!token && !isPublicPage) {
    return Response.redirect(new URL(`/${locale}/login`, request.url));
  }

  // 2. Redirect to dashboard if locale is root
  const locales = routing.locales;
  const isLocaleRoot = locales.some((locale) => pathname === `/${locale}`);
  if (isLocaleRoot) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // 3. No token and public page → allow through
  if (!token && isPublicPage) {
    return intlMiddleware(request);
  }

  // 4. Has token → verify it
  let isValidToken = false;
  if (token) {
    try {
      const { payload } = await jwtVerify(token.value, SECRET);
      isValidToken = payload.id ? true : false;
    } catch (e) {
      // Invalid token → delete the bad cookie and redirect to login
      const response = NextResponse.redirect(new URL(`/${locale}/login`, request.url));
      response.cookies.delete(COOKIE_NAME);
      console.log(e);
      return response;
    }
  }

  // 5. Valid token + public page → redirect to dashboard (already logged in)
  if (isValidToken && isPublicPage) {
    return Response.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // 6. Valid token + protected page → allow through
  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
