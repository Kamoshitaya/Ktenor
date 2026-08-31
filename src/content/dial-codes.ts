/**
 * Slovakia and its immediate neighbours first, since that is the actual
 * market; a handful of other common origins after; "other" as an escape
 * hatch rather than shipping a 200-row list of every country on earth for a
 * one-person studio site.
 *
 * Country names are looked up per-locale from the dictionaries
 * (`t.contact.countries`), not stored here — this file is just codes.
 */
export const dialCodes = [
  { id: "SK", code: "+421" },
  { id: "CZ", code: "+420" },
  { id: "AT", code: "+43" },
  { id: "HU", code: "+36" },
  { id: "PL", code: "+48" },
  { id: "DE", code: "+49" },
  { id: "GB", code: "+44" },
  { id: "IE", code: "+353" },
  { id: "US", code: "+1" },
  { id: "OTHER", code: "" },
] as const;

export type DialCodeId = (typeof dialCodes)[number]["id"];
