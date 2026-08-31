"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { defaultLocale, isLocale } from "@/i18n/config";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import en from "@/i18n/dictionaries/en";
import sk from "@/i18n/dictionaries/sk";

/**
 * A not-found boundary cannot read route params, so the locale is taken from
 * the path. Anything outside /sk and /en has no language to infer, and Slovak
 * is the default market.
 *
 * No video here: this is a page someone reached by mistake and it should not
 * cost them a megabyte. The ring is drawn, not filmed.
 */
export default function NotFound() {
  const pathname = usePathname();
  const segment = pathname.split("/")[1] ?? "";
  const locale = isLocale(segment) ? segment : defaultLocale;
  const t = locale === "en" ? en : sk;

  // A not-found boundary has no metadata API, and leaving the home page title
  // on a 404 is exactly the kind of detail this site is meant to get right.
  useEffect(() => {
    document.title = `${t.notFound.title} — Ktenor`;
  }, [t.notFound.title]);

  return (
    <div className="container-page flex min-h-[calc(100dvh-72px)] flex-col justify-center py-[var(--spacing-block)]">
      <div className="grid items-center gap-[var(--spacing-block)] lg:grid-cols-[1fr_0.9fr]">
        <div>
          <NotFoundMark className="w-full max-w-[420px]" />
        </div>

        <div>
          <h1 className="text-[length:var(--text-h1)]">{t.notFound.title}</h1>
          <p className="mt-6 max-w-[44ch] text-[length:var(--text-lead)] text-text-secondary">
            {t.notFound.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button href={`/${locale}`}>{t.actions.backHome}</Button>
            <Button href={`/${locale}#services`} variant="secondary">
              {t.notFound.services}
            </Button>
            <Button href={`/${locale}#work`} variant="secondary">
              {t.notFound.work}
            </Button>
          </div>

          <p className="mt-10 text-sm text-text-muted">
            {t.notFound.orWrite}{" "}
            <a
              href={`mailto:${site.contact.email}`}
              className="text-accent underline-offset-4 hover:underline"
            >
              {site.contact.email}
            </a>{" "}
            ·{" "}
            <a
              href={site.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline-offset-4 hover:underline"
            >
              WhatsApp
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

/** 4 0 4, where the zero is a ring in the language of the hero object. */
function NotFoundMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 180" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--c-accent-strong)" />
          <stop offset="55%" stopColor="var(--c-accent)" />
          <stop offset="100%" stopColor="var(--c-accent-deep)" />
        </linearGradient>
      </defs>

      <text
        x="0"
        y="146"
        fontFamily="var(--font-display)"
        fontSize="180"
        fontWeight="500"
        letterSpacing="-6"
        fill="currentColor"
      >
        4
      </text>

      <g transform="translate(150 20)">
        <circle cx="60" cy="70" r="56" stroke="url(#ring)" strokeWidth="14" />
        <circle cx="60" cy="70" r="30" stroke="var(--c-line-strong)" strokeWidth="2" />
      </g>

      <text
        x="285"
        y="146"
        fontFamily="var(--font-display)"
        fontSize="180"
        fontWeight="500"
        letterSpacing="-6"
        fill="currentColor"
      >
        4
      </text>
    </svg>
  );
}
