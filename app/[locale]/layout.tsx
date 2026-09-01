import { NextIntlClientProvider } from "next-intl";
import { getTranslations, getMessages, getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Locale } from "@/i18n/locale-config";
import { Toaster } from "sonner";
import Script from "next/script";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Index" });

  return { title: t("title"), description: t("subtitle") };
}

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  if (!(routing.locales as readonly string[]).includes(locale)) notFound();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="bg-zinc-950 text-white min-h-screen antialiased">
        <Script
          src="https://keepandroidopen.org/banner.js?size=minimal&link=https://keepandroidopen.org"
          strategy="afterInteractive"
        />
        <NextIntlClientProvider messages={messages}>
          <div className="fixed top-0 z-[100] flex items-center gap-2 p-4 mt-2">
            <LanguageSwitcher currentLocale={locale as Locale} />
          </div>
          {children}
          <Toaster richColors position="bottom-right" theme="system" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
