import { useTranslations } from "next-intl";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Home() {
  const t = useTranslations("Index");

  async function handleRandomRedirect() {
    "use server";

    const locale = await getLocale();
    const { data: randomSlug, error } = await supabase.rpc("get_random_slug");

    if (error || !randomSlug) {
      redirect(`/${locale}/404`);
    }

    redirect(`/${locale}/${randomSlug}`);
  }

  async function handleSearch(formData: FormData) {
    "use server";

    const rawQuery = formData.get("query")?.toString();

    if (!rawQuery) return;

    const cleanSlug = rawQuery.trim().toLowerCase().replace(/\s+/g, "-");

    if (!cleanSlug) return;
    const locale = await getLocale();

    redirect(`/${locale}/${cleanSlug}`);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-emerald-400">
        {t("title")}
      </h1>
      <p className="text-zinc-400 max-w-md text-lg mb-8">{t("subtitle")}</p>

      <div className="flex flex-col gap-5 w-full max-w-sm">
        <form
          action={handleSearch}
          className="flex w-full bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 focus-within:border-emerald-500 transition-colors"
        >
          <input
            type="text"
            name="query"
            placeholder={t("searchPlaceholder")}
            className="flex-1 bg-transparent px-4 py-3 text-zinc-100 outline-none placeholder:text-zinc-600"
            required
            autoComplete="off"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors font-medium"
          >
            {t("searchButton")}
          </button>
        </form>
        <div className="flex items-center gap-4 w-full">
          <div className="h-px bg-zinc-800 flex-1" />
          <span className="text-zinc-600 text-sm font-medium">{t("or")}</span>
          <div className="h-px bg-zinc-800 flex-1" />
        </div>
        <form action={handleRandomRedirect}>
          <button
            type="submit"
            className="w-full px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold transition"
          >
            {t("randomNumber")}
          </button>
        </form>
      </div>
    </main>
  );
}
