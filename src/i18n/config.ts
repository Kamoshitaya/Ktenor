export const locales = ["sk", "en"] as const;

export type Locale = (typeof locales)[number];

/** Slovakia is the market; the bare domain lands here. */
export const defaultLocale: Locale = "sk";

/** Text switcher only — flags are a poor proxy for language. */
export const localeLabels: Record<Locale, string> = { sk: "SK", en: "EN" };

/** Used for <html lang> and hreflang. */
export const localeTags: Record<Locale, string> = { sk: "sk-SK", en: "en" };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const LOCALE_COOKIE = "ktenor-locale";
