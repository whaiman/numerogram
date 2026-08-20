import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "az", "ru"];
export const defaultLocale = "en";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !locales.includes(locale)) {
    locale = defaultLocale;
  }

  const defaultMessages = (await import(`../messages/${defaultLocale}.json`))
    .default;
  const userMessages =
    locale === defaultLocale
      ? defaultMessages
      : (await import(`../messages/${locale}.json`)).default;

  const messages = { ...defaultMessages };
  for (const key of Object.keys(userMessages)) {
    messages[key] = { ...defaultMessages[key], ...userMessages[key] };
  }

  return {
    locale,
    messages,
  };
});
