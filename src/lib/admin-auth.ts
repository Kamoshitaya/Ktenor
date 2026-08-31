import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * A single shared password, not a user system — this gates one admin page
 * for one owner. Sessions are stateless: the cookie carries its own expiry
 * plus an HMAC over that expiry keyed with the password, so verifying it
 * needs no database row and "logging out" just means the browser stops
 * sending a cookie that would otherwise keep working until it expires.
 */
export const ADMIN_COOKIE = "ktenor_admin";
const SESSION_DAYS = 7;

function hashEqual(a: string, b: string): boolean {
  const bufA = createHash("sha256").update(a).digest();
  const bufB = createHash("sha256").update(b).digest();
  return timingSafeEqual(bufA, bufB);
}

export function checkPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return hashEqual(candidate, expected);
}

function sign(expiry: number, secret: string): string {
  return createHmac("sha256", secret).update(String(expiry)).digest("hex");
}

export function createSessionToken(): string {
  const secret = process.env.ADMIN_PASSWORD ?? "";
  const expiry = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  return `${expiry}.${sign(expiry, secret)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  const secret = process.env.ADMIN_PASSWORD;
  if (!token || !secret) return false;

  const [expiryRaw, signature] = token.split(".");
  const expiry = Number(expiryRaw);
  if (!expiryRaw || !signature || Number.isNaN(expiry) || Date.now() > expiry) return false;

  return hashEqual(signature, sign(expiry, secret));
}

export const SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60;

/** Shared by the admin page and every /api/admin/* route. */
export async function isAuthorized(): Promise<boolean> {
  const jar = await cookies();
  return verifySessionToken(jar.get(ADMIN_COOKIE)?.value);
}
