import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isLocale,
  matchLocale,
  LOCALE_COOKIE_NAME,
  LOCALE_COOKIE_MAX_AGE,
} from "./i18n/locale-config";

export function proxy(request: NextRequest) {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;

  if (isLocale(cookieLocale)) {
    return NextResponse.next();
  }

  const locale = matchLocale(request.headers.get("accept-language"));

  const response = NextResponse.next();
  response.cookies.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
