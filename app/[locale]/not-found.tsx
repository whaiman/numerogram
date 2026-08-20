import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "NotFound" });
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <h1 className="text-8xl md:text-9xl font-black text-zinc-800 tracking-tighter mb-4">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-bold text-zinc-200 mb-4">
        {/* Anomaly in the matrix */}
        {t("h1")}
      </h2>
      <p className="text-zinc-400 max-w-md mb-10 text-lg">
        {/* What you're looking for is neither a number nor a known constant.
        Perhaps it's a typo? */}
        {t("p")}
      </p>

      <div className="flex gap-4">
        <Link
          href={`/${locale}`}
          className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium transition"
        >
          {t("to-main")}
        </Link>
      </div>
    </main>
  );
}
