import { NextIntlClientProvider } from "next-intl";
import { getTranslations, getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Locale } from "@/i18n/locale-config";
import { Toaster } from "sonner";
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
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) notFound();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="bg-zinc-950 text-white min-h-screen antialiased">
        <NextIntlClientProvider messages={messages}>
          <div className="fixed top-4 left-6 z-[100] flex items-center gap-2">
            <LanguageSwitcher currentLocale={locale as Locale} />
          </div>
          {children}
          <Toaster richColors position="bottom-right" theme="system" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
