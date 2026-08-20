import { supabase } from "@/app/lib/supabase";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { getLocalizedData } from "@/utils/i18n";

interface Fact {
  id: number;
  content: any;
  upvotes: number;
  categories: {
    name: any;
    slug: string;
  };
}

export default async function NumberPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "NumberPage" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  const { data: dbnumberData, error } = await supabase
    .from("numbers")
    .select(
      `
    id, slug, is_constant, title, bio,
    facts (
    id, content, upvotes,
    categories (slug, name)
    )
    `,
    )
    .eq("slug", slug)
    .single();

  let numberData = dbnumberData;
  if (!numberData) {
    const numericValue = Number(slug);

    if (isNaN(numericValue)) {
      notFound();
    }
    numberData = {
      id: null,
      slug: slug,
      is_constant: false,
      title: {
        ru: `Число ${slug}`,
        en: `Number ${slug}`,
        az: `${slug} ədədi`,
      },
      bio: {
        ru: "Это неисследованное число. Информация о нем еще не добавлена в базу данных.",
        en: "This is an unexplored number. Information about it has not been added to the database yet.",
        az: "Bu araşdırılmamış ədəddir. Məlumat hələ bazaya əlavə edilməyib.",
      },
      facts: [],
    };
  }

  const title = getLocalizedData(numberData.title, locale);
  const bio = getLocalizedData(numberData.bio, locale);

  const isInt = !numberData.is_constant && !isNaN(Number(slug));
  const numericValue = isInt ? parseInt(slug, 10) : null;

  const isEven = numericValue !== null ? numericValue % 2 === 0 : null;
  const binary = numericValue !== null ? numericValue.toString(2) : null;

  const isSynthetic = numberData.id === null;

  return (
    <main className="min-h-screen max-w-3xl mx-auto p-6 flex flex-col gap-8">
      {/* Back button */}
      <nav className="mt-4">
        <Link
          href={`/${locale}`}
          className="text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-2"
        >
          ← {t("back")}
        </Link>
      </nav>

      {/* Number's profile */}
      <header className="text-center py-10 bg-zinc-900/50 rounded-3xl border border-zinc-800">
        {isSynthetic && (
          <span className="inline-block mb-4 text-xs font-bold uppercase racking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full">
            ⚡ {t("generatedProfile")}
          </span>
        )}

        <h1 className="text-7xl md:text-9xl font-black text-emerald-400 tracking-tighter mb-4 drop-shadow-lg">
          {numberData.slug.toUpperCase()}
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          {title}
        </h2>
        {bio && (
          <p className="text-zinc-400 max-w-xl mx-auto text-lg leading-relaxed px-4">
            {bio}
          </p>
        )}
      </header>

      {/* Number's passport */}
      {isInt && (
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
            📋 {t("passportTitle")}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/50">
              <span className="block text-zinc-500 text-sm mb-1">
                {t("parity")}
              </span>
              <span className="font-semibold text-lg text-zinc-200">
                {isEven ? t("even") : t("odd")}
              </span>
            </div>
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/50 overflow-x-auto">
              <span className="block text-zinc-500 text-sm mb-1">
                {t("binary")}
              </span>
              <span className="font-mono font-semibold text-lg text-emerald-400/80">
                {binary}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Facts */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">{t("factsTitle")}</h3>
          <button className="text-sm font-medium bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full hover:bg-emerald-500/20 transition">
            {t("addFactButton")}
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {numberData.facts && numberData.facts.length > 0 ? (
            numberData.facts.map((fact: Fact) => (
              <article
                key={fact.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 px-2 py-1 rounded">
                    {getLocalizedData(fact.categories.name, locale)}
                  </span>
                </div>
                <p className="text-zinc-200 text-lg leading-relaxed mb-4">
                  {getLocalizedData(fact.content, locale)}
                </p>
                <div className="flex items-center gap-4 border-t border-zinc-800/60 pt-3">
                  <button className="flex items-center gap-1 text-sm text-zinc-400 hover:text-emerald-400 transition">
                    ▲ {fact.upvotes || 0} {tCommon("upvote")}
                  </button>
                  <button className="text-sm text-zinc-500 hover:text-zinc-300 transition">
                    {tCommon("share")}
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="text-center py-10 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 border-dashed">
              <p className="text-zinc-500">{t("noFacts")}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
