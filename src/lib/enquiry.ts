export const budgetKeys = ["under500", "500to1500", "1500to3000", "over3000"] as const;
export type BudgetKey = (typeof budgetKeys)[number];

export type EnquiryErrorKey = "name" | "email" | "phone" | "service" | "business" | "consent";

export type Enquiry = {
  name: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  timeline: string;
  message: string;
  /**
   * The enquirer confirms they are ordering as a business or organisation,
   * not as a consumer. Services are sold B2B only (see site.b2bOnly), and
   * this is where that stops being a line in the terms and becomes something
   * each client actually stated.
   */
  business: boolean;
  consent: boolean;
  locale: string;
  /** Bot trap. A human never sees this field, so anything in it is a bot. */
  company?: string;
  /** When the form was first rendered, used to catch instant submissions. */
  startedAt?: number;
};

/** Deliberately permissive — the goal is to catch typos, not to police addresses. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Just as permissive: international numbers vary too much in length and
 * grouping to validate strictly. This exists to catch someone typing a name
 * into the field, not to police formatting.
 */
const PHONE = /^\+?[0-9()\-\s]{6,20}$/;

export const LIMITS = {
  name: 120,
  email: 160,
  phone: 40,
  timeline: 120,
  message: 4000,
} as const;

/**
 * One set of rules for both sides. The browser runs it for instant feedback and
 * the server runs it again because anything arriving over the network is
 * untrusted — client-side validation is a convenience, never a guarantee.
 *
 * Returns keys rather than sentences so each side can render them in the
 * visitor's language.
 */
export function validateEnquiry(input: Partial<Enquiry>): EnquiryErrorKey[] {
  const errors: EnquiryErrorKey[] = [];

  const name = (input.name ?? "").trim();
  const email = (input.email ?? "").trim();
  const phone = (input.phone ?? "").trim();

  if (!name) errors.push("name");
  // Both required: email carries the confirmation, phone is how the owner
  // reaches out directly — WhatsApp, a call, finding the person's socials.
  if (!email) errors.push("email");
  else if (!EMAIL.test(email)) errors.push("email");
  if (!phone) errors.push("phone");
  else if (!PHONE.test(phone)) errors.push("phone");
  // Services now come from the CMS (no fixed slug list to check against), so
  // this only confirms something was picked, not which service it was.
  if (!(input.service ?? "").trim()) errors.push("service");
  if (!input.business) errors.push("business");
  if (!input.consent) errors.push("consent");

  return errors;
}

export function isBudgetKey(value: string): value is BudgetKey {
  return (budgetKeys as readonly string[]).includes(value);
}

/** Trim and cap, so an oversized field cannot bloat an email or a spreadsheet row. */
export function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
