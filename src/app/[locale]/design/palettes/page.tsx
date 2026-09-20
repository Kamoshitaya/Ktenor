import type { ServicePackage } from "@/lib/cms";
import { PricingCard } from "@/components/sections/PricingCard";
import "./palettes.css";

/**
 * Internal page for choosing the redesign's palette. Not linked from the site.
 *
 * Each block re-declares the site's own colour tokens on a wrapper, so the
 * real components below render in that palette without being told about it.
 * That is the point of the exercise as much as the colours are: it shows the
 * whole redesign can land through tokens rather than a rewrite.
 */

const PALETTES = [
  {
    id: "ember",
    name: "Ember",
    line: "Fire on graphite",
    note: "Orange does the pointing, amber marks money, and one cold steel line keeps the logo's blue in play so the page never reads as uniformly orange.",
    swatches: ["#0b0c10", "#ff6b2c", "#ffb347", "#8aa0c6", "#f3efe9"],
  },
  {
    id: "voltage",
    name: "Voltage",
    line: "Orange against cyan",
    note: "Two bright colours of equal weight. Cyan carries every interaction, orange carries the prices, so warm and cold never fight over the same job.",
    swatches: ["#08090c", "#22d3ee", "#ff7a1a", "#b6c2d1", "#edf1f5"],
  },
  {
    id: "aurora",
    name: "Aurora",
    line: "Gradient dusk",
    note: "Violet base lit by orange and pink. The most fashionable of the three, and the one most likely to look like every other site of this year.",
    swatches: ["#120f1c", "#b794fb", "#fb923c", "#ec4899", "#f1ecf9"],
  },
] as const;

/* Shaped like the CMS rows the real section renders, so the cards below are
   the production component and not a lookalike. */
const sample = [
  {
    id: "mock-1",
    name: "Landing page",
    priceFrom: 690,
    description: "Jedna stránka, ktorá predáva: štruktúra, texty, dizajn a kód od začiatku do konca.",
    timeline: "2–3 týždne",
    included: [
      { id: "a", label: "Návrh a dizajn" },
      { id: "b", label: "Responzívny kód" },
      { id: "c", label: "SEO základ" },
      { id: "d", label: "Formulár a analytika" },
    ],
  },
  {
    id: "mock-2",
    name: "Firemný web",
    priceFrom: 1290,
    description: "Viacstránkový web s redakčným systémom, dvojjazyčnosťou a obsahom pripraveným na rast.",
    timeline: "4–6 týždňov",
    included: [
      { id: "a", label: "Až 8 stránok" },
      { id: "b", label: "CMS na úpravy" },
      { id: "c", label: "Dva jazyky" },
      { id: "d", label: "Školenie" },
    ],
  },
  {
    id: "mock-3",
    name: "E-shop",
    priceFrom: null,
    description: "Predaj naživo: katalóg, košík, platby a napojenie na sklad podľa toho, čo predávate.",
    timeline: "od 8 týždňov",
    included: [
      { id: "a", label: "Katalóg a filtre" },
      { id: "b", label: "Platobná brána" },
      { id: "c", label: "Doprava a sklad" },
    ],
  },
] as unknown as ServicePackage[];

export default function PalettesPage() {
  return (
    <div className="min-h-dvh bg-[#08090d]">
      <div className="container-page py-16">
        <p className="text-caption uppercase tracking-[0.22em] text-text-muted">
          Internal — redesign
        </p>
        <h1 className="mt-3 text-[length:var(--text-h2)]">Three palettes, same components</h1>
        <p className="mt-3 max-w-[60ch] text-text-secondary">
          Every block below runs the production hero treatment, buttons and pricing cards. Only
          the colour tokens differ.
        </p>
      </div>

      {PALETTES.map((palette) => (
        <section key={palette.id} data-palette={palette.id} className="palette">
          <div className="container-page py-20 sm:py-24">
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
              <p className="text-caption uppercase tracking-[0.22em] text-accent">
                {palette.name}
              </p>
              <p className="text-caption text-text-muted">{palette.line}</p>
            </div>
            <div className="mt-4 h-px w-full bg-[var(--c-line)]" />

            {/* --- Hero treatment ------------------------------------------ */}
            <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <p className="palette-heading">
                  Prémiové weby, navrhnuté a postavené <em>od začiatku do konca</em>.
                </p>
                <p className="mt-6 max-w-[52ch] text-[length:var(--text-lead)] text-text-secondary">
                  {palette.note}
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <a
                    href="#"
                    className="order-btn inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-gold-contrast"
                  >
                    Objednať web
                  </a>
                  <a href="#" className="link-rule text-sm font-medium text-accent">
                    Pozrieť práce
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {palette.swatches.map((hex) => (
                  <div key={hex} className="swatch">
                    <span style={{ background: hex }} />
                    <code className="text-[0.65rem] text-text-muted">{hex}</code>
                  </div>
                ))}
              </div>
            </div>

            {/* --- Pricing cards, the real component ----------------------- */}
            <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {sample.map((service) => (
                <PricingCard
                  key={service.id}
                  service={service}
                  fromLabel="od"
                  onRequestLabel="Na vyžiadanie"
                  timelineLabel="Termín"
                  whatsIncludedLabel="Čo je v cene"
                  orderLabel="Objednať"
                />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
