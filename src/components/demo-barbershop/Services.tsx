"use client";

import { useState } from "react";
import { serviceGroups } from "@/content/demo-barbershop/services";

const BLURBS: Record<string, string> = {
  Haircut: "Scissor & clipper work, finished with a hot towel.",
  Beard: "Shape, sculpt or fully restyle — always finished with oil.",
  Shave: "Straight razor, hot towel, no shortcuts.",
  Kids: "Patient hands, quick chairs, parent-approved.",
};

export function Services() {
  const [active, setActive] = useState(serviceGroups[0].category);
  const group = serviceGroups.find((g) => g.category === active)!;

  return (
    <section id="services" className="relative isolate py-20 md:py-28">
      <div className="section-wash" data-tone="copper" aria-hidden />
      <div className="container-page relative z-[1]">
        <header data-reveal className="mx-auto max-w-xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-copper">
            Services &amp; prices
          </p>
          <h2 className="mt-3 font-display text-[clamp(2.2rem,4vw,3rem)] uppercase leading-tight text-ivory">
            Work priced honestly.
          </h2>
          <p className="mt-3 text-sm text-ivory-muted">
            No packages you don&apos;t need. Every visit starts with a consultation.
          </p>
        </header>

        <div data-reveal className="mt-10 flex flex-wrap justify-center gap-2">
          {serviceGroups.map((g) => (
            <button
              key={g.category}
              type="button"
              onClick={() => setActive(g.category)}
              aria-pressed={active === g.category}
              className={`rounded-sm border px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] transition-colors ${
                active === g.category
                  ? "border-copper bg-copper text-charcoal-deep"
                  : "border-[var(--line)] text-ivory-soft hover:border-copper/40"
              }`}
            >
              {g.category}
            </button>
          ))}
        </div>

        <p data-reveal className="mt-6 text-center text-sm italic text-ivory-muted">
          {BLURBS[active]}
        </p>

        {/* No data-reveal here: Reveal.tsx only observes elements present at
            mount, so cards mounted later by a tab switch would never get
            data-revealed and stay stuck at opacity 0 forever. */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {group.items.map((item) => (
            <article
              key={item.name}
              className="card-hover rounded-lg border border-[var(--line)] bg-[var(--charcoal-raised)] p-6"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-[1.15rem] uppercase text-ivory">{item.name}</h3>
                <span className="shrink-0 font-display text-[1.15rem] text-copper">{item.price}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ivory-muted">{item.desc}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.1em] text-ivory-muted/70">
                {item.duration}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
