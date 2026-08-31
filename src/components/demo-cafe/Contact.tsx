import { site } from "@/content/demo-cafe/site";

export function Contact() {
  return (
    <section id="contact" className="relative isolate bg-[var(--cream-deep)] py-20 md:py-28">
      <div className="section-wash" data-tone="gold" aria-hidden />
      <div className="container-page relative z-[1]">
        <header data-reveal className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-terracotta">Visit</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.1] text-ink">
            {site.addressShort}, Bratislava.
          </h2>
        </header>

        <div data-reveal className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-[1fr_1.1fr]">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-7 sm:p-9">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-terracotta">
              Opening hours
            </h3>
            <dl className="mt-5 grid gap-2.5">
              {site.hours.map((h) => (
                <div key={h.day} className="flex items-baseline gap-2 text-sm">
                  <dt className="whitespace-nowrap text-ink-soft">{h.day}</dt>
                  <span aria-hidden className="h-px flex-1 translate-y-[-3px] border-b border-dotted border-[var(--line)]" />
                  <dd className="whitespace-nowrap font-semibold text-ink">{h.time}</dd>
                </div>
              ))}
              <div className="flex items-baseline gap-2 text-sm">
                <dt className="whitespace-nowrap text-ink-soft">Breakfast served</dt>
                <span aria-hidden className="h-px flex-1 translate-y-[-3px] border-b border-dotted border-[var(--line)]" />
                <dd className="whitespace-nowrap font-semibold text-ink">until 15:00 daily</dd>
              </div>
            </dl>

            <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-terracotta">
              Say hello
            </h3>
            <div className="mt-4 grid gap-2 text-sm">
              <a href={`tel:${site.phone}`} className="text-ink hover:text-terracotta">
                {site.phoneDisplay}
              </a>
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-terracotta hover:underline"
              >
                {site.instagram}
              </a>
              <a href={`mailto:${site.email}`} className="text-ink-soft hover:text-terracotta">
                {site.email}
              </a>
            </div>
            <p className="mt-6 text-xs text-ink-muted">
              Walk-ins only — we don&apos;t take reservations.
            </p>
          </div>

          <div className="min-h-[340px] overflow-hidden rounded-2xl border border-[var(--line)]">
            <iframe
              title="Ember & Oak location"
              src={site.mapEmbedSrc}
              loading="lazy"
              className="h-full w-full"
              style={{ border: 0, minHeight: 340 }}
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
