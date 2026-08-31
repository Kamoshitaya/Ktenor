import { site } from "@/content/demo-barbershop/site";

export function Contact() {
  return (
    <section id="contact" className="relative isolate py-20 md:py-28">
      <div className="section-wash" data-tone="copper" aria-hidden />
      <div className="container-page relative z-[1]">
        <header data-reveal className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-copper">Find us</p>
          <h2 className="mt-3 font-display text-[clamp(2.2rem,4vw,3rem)] uppercase leading-tight text-ivory">
            Karpatská 8, Staré Mesto.
          </h2>
        </header>

        <div data-reveal className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-[1.3fr_1fr]">
          <div className="overflow-hidden rounded-lg border border-[var(--line)]">
            <iframe
              title="Forge & Blade location"
              src={site.mapEmbedSrc}
              loading="lazy"
              className="h-full min-h-[340px] w-full"
              style={{ border: 0, filter: "grayscale(1) invert(92%) contrast(85%)" }}
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="rounded-lg border border-[var(--line)] bg-[var(--charcoal-raised)] p-7 sm:p-8">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-copper">
              Opening hours
            </h3>
            <span className="mt-2 block h-px w-8 bg-copper/60" />
            <dl className="mt-5 grid gap-2.5">
              {site.hours.map((h) => (
                <div key={h.day} className="flex items-baseline gap-2 text-sm">
                  <dt className="whitespace-nowrap text-ivory-soft">{h.day}</dt>
                  <span aria-hidden className="h-px flex-1 translate-y-[-3px] border-b border-dotted border-[var(--line)]" />
                  <dd className="whitespace-nowrap font-semibold text-ivory">{h.time}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-7 grid gap-2.5 border-t border-[var(--line)] pt-6 text-sm">
              <p className="text-ivory">{site.address}</p>
              <a href={`tel:${site.phone}`} className="text-copper hover:underline">
                {site.phoneDisplay}
              </a>
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-copper hover:underline"
              >
                {site.instagram}
              </a>
            </div>

            <p className="mt-7 inline-block rounded-sm border border-[var(--line)] px-3 py-1.5 text-[11px] uppercase tracking-[0.08em] text-ivory-muted">
              Fictional shop — Ktenor demo project
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
