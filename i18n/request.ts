import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import {
  isLocale,
  matchLocale,
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  type Locale,
} from "./locale-config";

export default getRequestConfig(async ({ requestLocale }) => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  let locale: Locale;
  if (isLocale(cookieLocale)) {
    locale = cookieLocale;
  } else {
    const headersList = await headers();
    locale = matchLocale(headersList.get("accept-language"));
  }

  const defaultMessages = (await import(`../messages/${DEFAULT_LOCALE}.json`))
    .default;

  if (locale === DEFAULT_LOCALE) {
    return { locale, messages: defaultMessages };
  }

  const userMessages = (await import(`../messages/${locale}.json`)).default;

  const messages = Object.fromEntries(
    Object.keys(defaultMessages).map((namespace) => [
      namespace,
      { ...defaultMessages[namespace], ...userMessages[namespace] },
    ]),
  );

  return { locale, messages };
});
