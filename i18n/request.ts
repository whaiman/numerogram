import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = routing.locales.includes(requested as any)
    ? (requested as (typeof routing.locales)[number])
    : routing.defaultLocale;

  const defaultMessages = (
    await import(`../messages/${routing.defaultLocale}.json`)
  ).default;

  if (locale === routing.defaultLocale) {
    return { locale, messages: defaultMessages };
  }

  const userMessages = (await import(`../messages/${locale}.json`)).default;
  const messages = Object.fromEntries(
    Object.keys(defaultMessages).map((ns) => [
      ns,
      { ...defaultMessages[ns], ...userMessages[ns] },
    ]),
  );

  return { locale, messages };
});
