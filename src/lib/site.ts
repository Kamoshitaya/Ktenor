const FALLBACK_ORIGIN = "https://ktenor.online";

/**
 * Reduce whatever is configured to a bare origin.
 *
 * Everything canonical hangs off this value — canonical links, hreflang, the
 * sitemap, the OG image — so a stray path or trailing slash does not stay a
 * small mistake: it is repeated into every URL the site publishes. A value
 * pasted straight from the address bar carries the locale prefix with it and
 * silently produces /sk/sk everywhere, which is exactly what happened.
 */
function toOrigin(value: string | undefined): string {
  if (!value) return FALLBACK_ORIGIN;
  try {
    return new URL(value.includes("://") ? value : `https://${value}`).origin;
  } catch {
    return FALLBACK_ORIGIN;
  }
}

/**
 * Single source of truth for anything that is not copy.
 *
 * The domain comes from the environment so it can change without touching
 * code. Vercel's own production URL is the second choice, which keeps preview
 * deployments honest when nothing is configured at all.
 */
export const site = {
  name: "Ktenor",
  legalName: "KTENOR",
  url: toOrigin(
    process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
  ),

  contact: {
    email: "ktenorstudio@gmail.com",
    /** E.164, used for tel: and wa.me */
    phone: "+421911608486",
    phoneDisplay: "+421 911 608 486",
    instagram: "kamoshitaya",
    instagramUrl: "https://instagram.com/kamoshitaya",
    get whatsappUrl() {
      return `https://wa.me/${this.phone.replace(/\D/g, "")}`;
    },
  },

  /** Meta/footer only — never in the hero headline. */
  region: { city: "Bratislava", country: "Slovakia" },

  features: {
    /** Flip to true once the first real client testimonial exists. */
    testimonials: false,
    /** Flip per project as each demo becomes reachable. */
    portfolioLinks: false,
    /** No backend yet — the form must not pretend a submission succeeded. */
    contactFormBackend: false,
    analytics: false,
  },
} as const;

export type Site = typeof site;
