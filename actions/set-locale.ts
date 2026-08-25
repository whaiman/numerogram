"use server";

import { cookies } from "next/headers";
import {
  isLocale,
  LOCALE_COOKIE_NAME,
  LOCALE_COOKIE_MAX_AGE,
  type Locale,
} from "@/i18n/locale-config";

export async function setLocale(locale: Locale) {
  if (!isLocale(locale)) return; // защита от невалидного значения в рантайме

  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
}
