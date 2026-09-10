/**
 * Root & Bloom is bilingual, and the copy is data rather than a pair of
 * parallel dictionaries: keeping sk and en adjacent on the same object means a
 * new treatment cannot ship with one language quietly missing.
 */
export type Localized = { sk: string; en: string };

export type DemoLocale = keyof Localized;

/** Reads one side of a Localized value. */
export function t(value: Localized, locale: DemoLocale): string {
  return value[locale];
}
