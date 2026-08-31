import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

import { isAuthorized } from "@/lib/admin-auth";

/**
 * Fixes a bug in the original seed: updating a localized array field twice
 * (once per locale) without passing back the row ids Payload generated on
 * the first write makes the second write replace the rows instead of
 * merging into them — the sk-only "included" list ended up orphaned when
 * the en pass ran. This re-does both writes for the same six rows,
 * capturing the ids from the sk write and reusing them for the en write.
 * Delete this route once it's been called successfully.
 */
export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "services",
    where: { isAddon: { equals: false } },
    sort: "order",
    limit: 20,
    pagination: false,
  });

  const results: Record<string, string> = {};

  for (const item of INCLUDED_BY_ORDER) {
    const doc = docs.find((d) => d.order === item.order);
    if (!doc) {
      results[String(item.order)] = "no matching service found — skipped";
      continue;
    }

    const skUpdated = await payload.update({
      collection: "services",
      id: doc.id,
      locale: "sk",
      data: { included: item.sk.map((label) => ({ label })) },
    });

    const rowIds = (skUpdated.included ?? []).map((row) => row.id);

    await payload.update({
      collection: "services",
      id: doc.id,
      locale: "en",
      data: {
        included: item.en.map((label, i) => ({ id: rowIds[i], label })),
      },
    });

    results[String(item.order)] = `fixed: ${doc.id} (${rowIds.length} rows)`;
  }

  return NextResponse.json({ ok: true, results });
}

const INCLUDED_BY_ORDER = [
  {
    order: 0,
    sk: [
      "Jednostránkový web",
      "Plne responzívny dizajn (mobil, tablet, desktop)",
      "Sekcia menu / služby",
      "Blok s kontaktnými údajmi",
      "Vložená Google mapa",
      "Odkazy na sociálne siete",
      "Tlačidlo na volanie / WhatsApp",
      "Základné SEO na stránke",
      "Rýchle načítanie, optimalizované obrázky",
      "Jedno kolo úprav pred spustením",
    ],
    en: [
      "One-page website",
      "Fully responsive design (mobile, tablet, desktop)",
      "Menu / services section",
      "Contact information block",
      "Embedded Google Maps",
      "Social media links",
      "Click-to-call / WhatsApp button",
      "Basic on-page SEO",
      "Fast loading, optimized images",
      "One round of pre-launch adjustments",
    ],
  },
  {
    order: 1,
    sk: [
      "Hero sekcia s jasným nadpisom a CTA",
      "Presvedčivá štruktúra textu (problém → riešenie → prínos)",
      "Sekcia funkcií / výhod",
      "Sekcia referencií a recenzií",
      "Sekcia časté otázky (FAQ)",
      "Kontaktný formulár na zber dopytov",
      "Opakované tlačidlo výzvy k akcii",
      "Animácie pri scrollovaní a mikrointerakcie",
      "Plne responzívny dizajn",
      "SEO na stránke (meta tagy, štruktúra nadpisov)",
      "Rýchle načítanie, optimalizované na konverzie",
      "Pripravené na analytiku (Google Analytics / Meta Pixel)",
    ],
    en: [
      "Hero section with a clear headline and CTA",
      "Persuasive copy structure (problem → solution → benefit)",
      "Features / benefits section",
      "Testimonials / social proof section",
      "FAQ section",
      "Contact form for lead capture",
      "Repeated call-to-action button",
      "Scroll animations and micro-interactions",
      "Fully responsive design",
      "On-page SEO (meta tags, heading structure)",
      "Fast loading, optimized for conversions",
      "Analytics-ready (Google Analytics / Meta Pixel)",
    ],
  },
  {
    order: 2,
    sk: [
      "Viacero sekcií na prezentáciu prác",
      "Galéria projektov",
      "Detail jednotlivých projektov",
      "Sekcia „O mne“",
      "Prehľad služieb",
      "Kontaktná sekcia / formulár",
      "Plynulé animácie pri scrollovaní",
      "Rýchlo sa načítavajúce, na obrázky zamerané galérie",
      "Plne responzívny dizajn",
      "SEO na stránke",
      "Prepojenie na sociálne siete",
      "Vizuálna identita prispôsobená vašej značke",
    ],
    en: [
      "Multiple sections for showcasing work",
      "Projects / gallery grid",
      "Individual project detail views",
      "About section",
      "Services overview",
      "Contact section / form",
      "Smooth scroll animations",
      "Image-focused, fast-loading galleries",
      "Fully responsive design",
      "On-page SEO",
      "Social media integration",
      "Visual identity matched to your brand",
    ],
  },
  {
    order: 3,
    sk: [
      "Viacero samostatných stránok (domov, o nás, služby, kontakt...)",
      "Prehľadná navigácia a štruktúra webu",
      "Stránky so službami / ponukou",
      "Sekcia o firme / tíme",
      "Kontaktná stránka s formulárom a mapou",
      "SEO na všetkých podstránkach",
      "Integrácie tretích strán (rezervácie, newsletter, chat...)",
      "Plne responzívny dizajn",
      "Optimalizovaný výkon",
      "Obsah pripravený na jednoduché budúce úpravy",
      "Nastavenie analytiky",
    ],
    en: [
      "Multiple dedicated pages (home, about, services, contact...)",
      "Clear navigation and site structure",
      "Services / offerings pages",
      "About / team section",
      "Contact page with form and map",
      "On-page SEO across all pages",
      "Third-party integrations (booking, newsletter, chat...)",
      "Fully responsive design",
      "Optimized performance",
      "Content structured for easy future updates",
      "Analytics setup",
    ],
  },
  {
    order: 4,
    sk: [
      "Katalóg produktov s kategóriami",
      "Stránky jednotlivých produktov",
      "Nákupný košík",
      "Proces platby / platobná brána",
      "Potvrdenie objednávky a e-mailové notifikácie",
      "Štruktúra pripravená na správu skladu",
      "Vyhľadávanie a filtrovanie produktov",
      "Plne responzívny, mobilne optimalizovaný nákupný zážitok",
      "Bezpečná platba (SSL, zabezpečená brána)",
      "Základné SEO produktových stránok",
      "Rýchle načítanie aj napriek bohatému obsahu",
      "Jednoduchá správa produktov",
    ],
    en: [
      "Product catalogue with categories",
      "Individual product pages",
      "Shopping cart",
      "Checkout flow / payment gateway",
      "Order confirmation and email notifications",
      "Structure ready for inventory management",
      "Product search and filtering",
      "Fully responsive, mobile-optimized shopping experience",
      "Secure checkout (SSL, secure payment gateway)",
      "Basic SEO for product pages",
      "Fast loading despite rich media",
      "Easy product management",
    ],
  },
  {
    order: 5,
    sk: [
      "Úplne individuálny rozsah, dohodnutý spoločne",
      "Ľubovoľná kombinácia funkcií z ostatných balíkov",
      "Unikátna funkcionalita postavená presne na mieru",
      "Rozsah a cena stanovené po krátkom úvodnom rozhovore",
    ],
    en: [
      "Fully custom scope, defined together",
      "Any combination of features from the other packages",
      "Unique functionality built to your exact requirements",
      "Scope and price set after a short discovery call",
    ],
  },
];
