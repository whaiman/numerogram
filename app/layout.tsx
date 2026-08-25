import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations, getMessages } from "next-intl/server";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Locale } from "@/i18n/locale-config";
import "./globals.css";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "Index" });

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="bg-zinc-950 text-white min-h-screen antialiased">
        <div className="absolute">
          <LanguageSwitcher currentLocale={locale as Locale} />
        </div>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
