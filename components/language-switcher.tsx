"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/i18n/locale-config";
import { Check, ChevronDown, Globe } from "lucide-react";

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitch = (locale: Locale) => {
    setIsOpen(false);
    if (locale === currentLocale) return;
    startTransition(() => {
      router.replace(pathname, { locale });
    });
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        disabled={isPending}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl text-sm font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition ${
          isPending ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <Globe size={16} className="text-emerald-400" />
        {LOCALE_LABELS[currentLocale]}
        <ChevronDown
          size={16}
          className={`text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute left-0 mt-2 w-40 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl z-50"
        >
          {LOCALES.map((loc) => (
            <li key={loc}>
              <button
                type="button"
                role="option"
                aria-selected={loc === currentLocale}
                onClick={() => handleSwitch(loc)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm text-left text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
              >
                {LOCALE_LABELS[loc]}
                {loc === currentLocale && (
                  <Check size={14} className="text-emerald-400" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
