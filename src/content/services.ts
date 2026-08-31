/**
 * Services and FAQ used to live here (language-independent facts) plus the
 * dictionaries (copy). Both now come from the CMS (see src/lib/cms.ts) —
 * this file keeps only what's still hardcoded: process/principles/advantages
 * section ids and the demo project registry.
 */
export const processIds = [
  "analysis",
  "planning",
  "design",
  "development",
  "testing",
  "launch",
] as const;

export type ProcessId = (typeof processIds)[number];

export const principleIds = [
  "honesty",
  "deadlines",
  "details",
  "quality",
  "result",
  "transparency",
] as const;

export const advantageIds = [
  "direct",
  "stack",
  "performance",
  "responsive",
  "seo",
  "bespoke",
] as const;

/**
 * Demo builds shown in the Work section in place of real client projects,
 * which don't exist yet. Each id maps to a route under /demo/<id>, a fully
 * standalone site (own layout, fonts, palette) linked from Work.tsx.
 */
export const projectIds = ["cafe", "barbershop", "dental", "realestate"] as const;

/** Only demos that actually exist render; the rest are future work. */
export const builtProjectIds = ["cafe", "barbershop"] as const;

export type ProjectId = (typeof projectIds)[number];
