"use client";

import { usePathname } from "next/navigation";
import { defaultLocale, isLocale } from "@/i18n/config";
import { site } from "@/lib/site";
import en from "@/i18n/dictionaries/en";
import sk from "@/i18n/dictionaries/sk";

/**
 * Same composition as the 404 but deliberately simpler: if something has
 * already failed, the recovery page should depend on as little as possible.
 */
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  const pathname = usePathname();
  const segment = pathname.split("/")[1] ?? "";
  const locale = isLocale(segment) ? segment : defaultLocale;
  const t = locale === "en" ? en : sk;

  return (
    <div className="container-page flex min-h-[calc(100dvh-72px)] flex-col justify-center py-[var(--spacing-block)]">
      <div className="max-w-[48ch]">
        <span aria-hidden className="flex gap-1.5">
          <span className="h-6 w-1 rounded-full bg-accent" />
          <span className="h-6 w-1 rounded-full bg-accent-mid" />
          <span className="h-6 w-1 rounded-full bg-accent-deep" />
        </span>
        <h1 className="mt-8 text-[length:var(--text-h1)]">{t.error.title}</h1>
        <p className="mt-6 text-[length:var(--text-lead)] text-text-secondary">
          {t.error.description}
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="cursor-pointer rounded-[var(--radius-sm)] bg-text px-7 py-4 text-sm font-medium text-bg transition-[background-color,transform] duration-[var(--dur-base)] hover:bg-silver active:scale-[0.98]"
          >
            {t.error.retry}
          </button>
          <a
            href={`mailto:${site.contact.email}`}
            className="glass rounded-[var(--radius-sm)] px-7 py-4 text-sm font-medium transition-colors duration-[var(--dur-base)] hover:bg-[var(--glass-bg-hover)]"
          >
            {site.contact.email}
          </a>
        </div>
      </div>
    </div>
  );
}
