"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LOCALE_COOKIE,
  localeLabels,
  locales,
  type Locale,
} from "@/i18n/config";

type Props = {
  current: Locale;
  label: string;
  className?: string;
};

/**
 * Real links, not a JS-only control: the other language stays crawlable and
 * middle-click still works. The choice is remembered so a return visit to the
 * bare domain lands on the right language.
 */
export function LanguageSwitcher({ current, label, className }: Props) {
  const pathname = usePathname();

  function hrefFor(locale: Locale) {
    const rest = pathname.replace(/^\/(sk|en)(?=\/|$)/, "");
    return `/${locale}${rest}`;
  }

  return (
    <div
      role="group"
      aria-label={label}
      className={`flex items-center gap-0.5 ${className ?? ""}`}
    >
      {locales.map((locale) => {
        const active = locale === current;
        return (
          <Link
            key={locale}
            href={hrefFor(locale)}
            hrefLang={locale}
            aria-current={active ? "true" : undefined}
            onClick={() => {
              document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
            }}
            className={`grid min-h-11 min-w-11 place-items-center rounded-[var(--radius-xs)] px-2 text-caption font-medium tracking-[0.12em] transition-colors duration-[var(--dur-base)] ease-[var(--ease-standard)] ${
              active
                ? "text-text"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {localeLabels[locale]}
          </Link>
        );
      })}
    </div>
  );
}
