export function getLocalizedData(data: any, locale: string): string {
  if (!data) return "";
  return data[locale] || data["en"] || "";
}
