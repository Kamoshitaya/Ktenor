import type { DemoLocale } from "@/content/demo-dental/types";

/**
 * The chosen language lives in localStorage, which is an external store rather
 * than React state. Reading it in an effect and calling setState works, but it
 * renders once with the wrong language and then again with the right one —
 * useSyncExternalStore is what this is for, and it keeps the server render
 * ("sk", the clinic's default) consistent with hydration.
 */
const KEY = "rootandbloom-locale";

let cached: DemoLocale | null = null;
const listeners = new Set<() => void>();

function read(): DemoLocale {
  if (cached) return cached;
  try {
    const stored = window.localStorage.getItem(KEY);
    cached = stored === "en" || stored === "sk" ? stored : "sk";
  } catch {
    /* Private mode denies access; the default is fine. */
    cached = "sk";
  }
  return cached;
}

export const localeStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getSnapshot(): DemoLocale {
    return read();
  },

  /** Slovakia is the market, so the server always renders Slovak. */
  getServerSnapshot(): DemoLocale {
    return "sk";
  },

  set(next: DemoLocale) {
    if (cached === next) return;
    cached = next;
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      /* Choice simply does not persist. */
    }
    listeners.forEach((listener) => listener());
  },
};
