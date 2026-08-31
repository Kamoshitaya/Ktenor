import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import { site } from "@/lib/site";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

type Props = { locale: Locale; t: Dictionary };

export function Footer({ locale, t }: Props) {
  const nav = [
    { href: `/${locale}#work`, label: t.nav.work },
    { href: `/${locale}#services`, label: t.nav.services },
    { href: `/${locale}#process`, label: t.nav.process },
    { href: `/${locale}#about`, label: t.nav.about },
    { href: `/${locale}#faq`, label: t.nav.faq },
    { href: `/${locale}#contact`, label: t.nav.contact },
  ];

  return (
    <footer className="border-t border-line">
      <div className="container-page py-[var(--spacing-block)]">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-3 rounded-[var(--radius-xs)]"
            >
              <Logo className="h-8 w-auto" />
              <span
                className="font-display text-[1.05rem] font-medium uppercase leading-none"
                style={{ letterSpacing: "0.18em" }}
              >
                Ktenor
              </span>
            </Link>
            <p className="mt-5 max-w-[34ch] text-sm text-text-secondary">
              {t.footer.tagline}
            </p>
            <p className="mt-3 max-w-[34ch] text-caption text-text-muted">
              {t.footer.location}
            </p>
          </div>

          <nav aria-label={t.footer.navTitle}>
            <h2 className="text-caption uppercase tracking-[0.18em] text-text-muted">
              {t.footer.navTitle}
            </h2>
            <ul className="mt-3 space-y-0">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-sm text-text-secondary transition-colors duration-[var(--dur-base)] hover:text-text"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-caption uppercase tracking-[0.18em] text-text-muted">
              {t.footer.contactTitle}
            </h2>
            {/* Tight spacing: the rows already carry 44px of tap height. */}
            <ul className="mt-3 space-y-0 text-sm">
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="inline-flex min-h-11 items-center text-text-secondary transition-colors duration-[var(--dur-base)] hover:text-text"
                >
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.contact.phone}`}
                  className="inline-flex min-h-11 items-center text-text-secondary transition-colors duration-[var(--dur-base)] hover:text-text"
                >
                  {site.contact.phoneDisplay}
                </a>
              </li>
              <li className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
                <a
                  href={site.contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-text-secondary transition-colors duration-[var(--dur-base)] hover:text-text"
                >
                  WhatsApp
                </a>
                <a
                  href={site.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-text-secondary transition-colors duration-[var(--dur-base)] hover:text-text"
                >
                  Instagram
                </a>
              </li>
            </ul>

            <h2 className="mt-9 text-caption uppercase tracking-[0.18em] text-text-muted">
              {t.footer.settingsTitle}
            </h2>
            <div className="mt-3 flex items-center gap-2">
              <LanguageSwitcher current={locale} label={t.language.label} />
              <span aria-hidden className="h-5 w-px bg-line-strong" />
              <ThemeToggle labels={{ toDark: t.theme.toDark, toLight: t.theme.toLight }} />
            </div>
          </div>
        </div>

        <div className="mt-[var(--spacing-block)] flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8 text-caption text-text-muted">
          <p>
            © {new Date().getFullYear()} {site.legalName}. {t.footer.rights}
          </p>
          <Link
            href={`/${locale}/privacy`}
            className="inline-flex min-h-11 items-center transition-colors duration-[var(--dur-base)] hover:text-text-secondary"
          >
            {t.footer.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
