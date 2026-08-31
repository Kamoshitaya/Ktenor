export type ReviewErrorKey = "name" | "rating" | "email";

export type ReviewInput = {
  name: string;
  role?: string;
  email?: string;
  rating: number;
  quote?: string;
  locale: string;
  /** Bot trap, mirrors the contact form. */
  company?: string;
  startedAt?: number;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const LIMITS = {
  name: 120,
  role: 120,
  email: 160,
  quote: 600,
} as const;

/**
 * Name and a star rating are the only things a review cannot exist without —
 * the quote is deliberately optional, matching the "stars first, a short
 * line under them if you feel like it" shape the owner asked for.
 */
export function validateReview(input: Partial<ReviewInput>): ReviewErrorKey[] {
  const errors: ReviewErrorKey[] = [];

  const name = (input.name ?? "").trim();
  const email = (input.email ?? "").trim();
  const rating = input.rating;

  if (!name) errors.push("name");
  if (email && !EMAIL.test(email)) errors.push("email");
  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    errors.push("rating");
  }

  return errors;
}

export function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
