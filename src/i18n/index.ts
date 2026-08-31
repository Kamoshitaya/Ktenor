import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/en";

/**
 * Dynamic imports keep the unused language out of the bundle.
 */
const dictionaries = {
  sk: () => import("./dictionaries/sk").then((m) => m.default),
  en: () => import("./dictionaries/en").then((m) => m.default),
} satisfies Record<Locale, () => Promise<Dictionary>>;

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}

export type { Dictionary };
