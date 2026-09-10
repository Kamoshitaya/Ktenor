"use client";

import { useDental } from "./DentalContext";

/**
 * Says plainly that the clinic is invented. The page carries an address, a
 * phone number and prices, and without this strip someone arriving from a
 * search result has no way to know none of it is real.
 */
export function DemoBanner() {
  const { t } = useDental();

  return (
    <div className="bg-sage-900 text-cream">
      <div className="rb-container flex flex-wrap items-center justify-center gap-x-2 gap-y-1 py-2 text-center text-[0.8rem] leading-snug">
        <span>
          {t({
            sk: "Ukážkový projekt — Root & Bloom je vymyslená ambulancia.",
            en: "Demo project — Root & Bloom is a fictional practice.",
          })}
        </span>
        {/*
          A plain anchor, not next/link, and deliberately so: the demo declares
          its own <html>, so leaving it is a document-level navigation whatever
          we use here. Link would only pretend otherwise.
        */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          className="font-semibold underline decoration-sage-500 underline-offset-2 transition-colors hover:text-sage-300"
        >
          {t({ sk: "Web postavil Ktenor", en: "Built by Ktenor" })}
        </a>
      </div>
    </div>
  );
}
