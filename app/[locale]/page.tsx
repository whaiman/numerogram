import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { supabase } from "../lib/supabase";
import type { Locale } from "../../i18n/locale-config";

const GITHUB_USERNAME = "whaiman";
const REPO_NAME = "numerogram";

function slugifyQuery(raw: string): string {
  let s = raw.trim().toLowerCase();

  s = s.replace(/(\d),(\d)/g, "$1.$2");
  s = s.replace(/(\d)\s+(?=\d)/g, "$1");
  s = s.replace(/\s+/g, "-");
  s = s.replace(/[^\p{L}\p{N}\-.]+/gu, "");
  s = s.replace(/(?<!\d)\.|\.(?!\d)/g, "");
  s = s.replace(/-+/g, "-");
  s = s.replace(/-$/, "");
  s = s.replace(/^-(?!\d)/, "");

  return s;
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Index" });
  const tf = await getTranslations({ locale, namespace: "Footer" });

  async function handleRandomRedirect() {
    "use server";
    const { data: randomSlug, error } = await supabase.rpc("get_random_slug");

    if (error || !randomSlug) {
      notFound();
    }

    redirect(`/${locale}/${randomSlug}`);
  }

  async function handleSearch(formData: FormData) {
    "use server";

    const rawQuery = formData.get("query")?.toString();

    if (!rawQuery) return;

    const cleanSlug = slugifyQuery(rawQuery);

    const targetSlug = cleanSlug || rawQuery.trim();

    redirect(`/${locale}/${encodeURIComponent(targetSlug)}`);
  }

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
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

      <footer className="border-t border-zinc-800 py-6 px-6">
        <div className="max-w-sm mx-auto flex flex-col items-center gap-3">
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <span>{tf("madeBy")}</span>
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-zinc-300 hover:text-emerald-400 transition-colors font-medium"
              aria-label={`GitHub profile of ${GITHUB_USERNAME}`}
            >
              <img
                src="/github.svg"
                alt=""
                className="w-4 h-4 invert opacity-60"
              />
              {tf("githubProfile")}
            </a>
            <span className="text-zinc-700">·</span>
            <a
              href={`https://github.com/${GITHUB_USERNAME}/${REPO_NAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-300 hover:text-emerald-400 transition-colors font-medium"
              aria-label={`${REPO_NAME} repository on GitHub`}
            >
              {tf("repoLabel")}
            </a>
          </div>
          <p className="text-xs text-zinc-600">
            © {currentYear} {tf("githubProfile")} · {tf("rights")}
          </p>
        </div>
      </footer>
    </div>
  );
}
