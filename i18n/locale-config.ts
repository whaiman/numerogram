import { routing } from "./routing";

export type Locale = (typeof routing.locales)[number];
export const LOCALES = routing.locales;

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  az: "Azərbaycanca",
};
