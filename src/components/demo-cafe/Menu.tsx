"use client";

import { useState } from "react";
import Image from "next/image";
import { menu } from "@/content/demo-cafe/menu";

const BLURBS: Record<string, string> = {
  Coffee: "Seasonal single origins, roasted in small batches at our own roastery.",
  Breakfast: "Served until 15:00, every day, no exceptions.",
  Desserts: "Baked each morning — once they're gone, they're gone.",
};

export function Menu() {
  const [active, setActive] = useState(menu[0].category);
  const group = menu.find((g) => g.category === active)!;

  return (
    <section id="menu" className="relative isolate py-20 md:py-28">
      <div className="section-wash" data-tone="terracotta" aria-hidden />
      <div className="container-page relative z-[1]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <header data-reveal className="max-w-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-terracotta">
              The menu
            </p>
            <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.1] text-ink">
              Thirty-three good reasons to stay another hour.
            </h2>
          </header>

          <div data-reveal className="flex shrink-0 flex-wrap gap-2">
            {menu.map((g) => (
              <button
                key={g.category}
                type="button"
                onClick={() => setActive(g.category)}
                aria-pressed={active === g.category}
                className={`rounded-sm border px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${
                  active === g.category
                    ? "border-ink bg-ink text-[var(--cream)]"
                    : "border-[var(--line)] text-ink-soft hover:border-terracotta/50"
                }`}
              >
                {g.category}
                <span className={active === g.category ? "text-[var(--cream)]/60" : "text-ink-muted"}>
                  {" "}
                  · {g.items.length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <p data-reveal className="mt-4 text-sm text-ink-muted">
          {BLURBS[active]}
        </p>

        {/* No data-reveal here: Reveal.tsx only observes elements present at
            mount, so cards mounted later by a tab switch would never get
            data-revealed and stay stuck at opacity 0 forever. */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {group.items.map((item) => (
            <article
              key={item.name}
              className="card-hover overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={item.photo}
                  alt={item.name}
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h4 className="font-display text-[1.1rem] leading-snug text-ink">
                    {item.name}
                  </h4>
                  <span className="shrink-0 text-sm font-semibold text-terracotta-deep">
                    {item.price}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
