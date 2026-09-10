"use client";

import { copy } from "@/content/demo-dental/copy";
import { clinic, openingHours } from "@/content/demo-dental/site";
import { useDental } from "./DentalContext";
import { hrefFor, navLabels, viewIds } from "./routes";
import { ToothMark } from "./ToothMark";

export function Footer() {
  const { t, go } = useDental();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-sage-900 text-sage-200">
      <div className="rb-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="flex items-center gap-2.5 text-cream">
            <ToothMark size={32} />
            <span className="font-display text-lg font-bold">{clinic.name}</span>
          </span>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">{t(copy.footer.blurb)}</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-cream">
            {t(copy.footer.navTitle)}
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {viewIds.map((id) => (
              <li key={id}>
                <a
                  href={hrefFor(id)}
                  onClick={(event) => {
                    event.preventDefault();
                    go(id);
                  }}
                  className="transition-colors hover:text-cream"
                >
                  {t(navLabels[id])}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-cream">
            {t(copy.footer.contactTitle)}
          </h2>
          <address className="mt-4 space-y-2.5 text-sm not-italic">
            <p>
              {clinic.address.street}
              <br />
              {clinic.address.postal} {clinic.address.city}
            </p>
            <p>
              <a href={clinic.phoneHref} className="transition-colors hover:text-cream">
                {clinic.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${clinic.email}`} className="transition-colors hover:text-cream">
                {clinic.email}
              </a>
            </p>
            <p>
              <a
                href={clinic.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-cream"
              >
                {clinic.instagram}
              </a>
            </p>
          </address>
        </div>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-cream">
            {t(copy.footer.hoursTitle)}
          </h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt>{t(copy.footer.weekdays)}</dt>
              <dd className="tabular">8:00 – 18:00</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>{t(copy.footer.saturday)}</dt>
              <dd className="tabular">{t(openingHours[5]!.hours)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="border-t border-sage-700/50">
        <div className="rb-container flex flex-col items-center justify-between gap-3 py-6 text-xs sm:flex-row">
          <p>
            © {year} {clinic.fullName} — {t(copy.footer.rights)}
          </p>
          <p>
            {t(copy.footer.builtBy)}{" "}
            {/* Plain anchor on purpose — see DemoBanner. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className="font-semibold text-cream underline underline-offset-2">
              Ktenor
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
