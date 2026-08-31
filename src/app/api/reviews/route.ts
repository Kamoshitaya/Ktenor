import { NextResponse } from "next/server";
import { site } from "@/lib/site";
import { insertVisitorReview } from "@/lib/db";
import { sendEmail, escapeHtml } from "@/lib/email";
import { clean, validateReview, LIMITS, type ReviewInput } from "@/lib/review";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Public review submissions. Same shape as /api/contact: a honeypot and a
 * minimum fill time catch bots without a captcha, a crude per-IP rate limit
 * blunts a flood, and nothing ever gets published without landing as
 * `pending` first — this endpoint can only ever create work for the owner to
 * review, never put text on the site directly.
 */

const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
const MIN_FILL_MS = 2000;

const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT.windowMs)) hits.delete(key);
    }
  }
  return recent.length > RATE_LIMIT.max;
}

export async function POST(request: Request) {
  let body: Partial<ReviewInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "malformed" }, { status: 400 });
  }

  const honeypotFilled = Boolean(clean(body.company, 100));
  const tooFast =
    typeof body.startedAt === "number" && Date.now() - body.startedAt < MIN_FILL_MS;
  if (honeypotFilled || tooFast) {
    console.warn("[reviews] trapped", { honeypotFilled, tooFast });
    return NextResponse.json({ ok: true });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  }

  const input: ReviewInput = {
    name: clean(body.name, LIMITS.name),
    rating: typeof body.rating === "number" ? Math.round(body.rating) : NaN,
    quote: clean(body.quote, LIMITS.quote) || undefined,
    locale: body.locale === "en" ? "en" : "sk",
  };

  const errors = validateReview(input);
  if (errors.length > 0) {
    return NextResponse.json({ ok: false, reason: "invalid", errors }, { status: 400 });
  }

  let saved;
  try {
    saved = await insertVisitorReview({
      name: input.name,
      role: null,
      email: null,
      rating: input.rating,
      quote: input.quote ?? null,
      locale: input.locale,
    });
  } catch (err) {
    console.error("[reviews] insert failed", err);
    return NextResponse.json({ ok: false, reason: "delivery" }, { status: 502 });
  }

  // Best effort: the review is already safely stored either way.
  notifyOwnerOfReview(saved.name, saved.rating, saved.quote).catch((err) => {
    console.error("[reviews] owner notification failed", err);
  });

  return NextResponse.json({ ok: true });
}

async function notifyOwnerOfReview(name: string, rating: number, quote: string | null) {
  const to = process.env.CONTACT_TO_EMAIL || site.contact.email;
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
  const adminUrl = `${site.url}/admin/reviews`;

  const html = `
<div style="background:#0b0c11;padding:32px;font-family:-apple-system,Segoe UI,sans-serif">
  <div style="max-width:560px;margin:0 auto;background:#101319;border:1px solid rgba(238,239,244,.1);border-radius:14px;padding:28px">
    <p style="margin:0 0 4px;color:#6e8fc4;font-size:12px;letter-spacing:.18em;text-transform:uppercase">New review — pending</p>
    <h1 style="margin:0 0 8px;color:#eeeff4;font-size:22px;font-weight:600">${escapeHtml(name)}</h1>
    <p style="margin:0 0 20px;color:#6e8fc4;font-size:18px;letter-spacing:2px">${stars}</p>
    ${
      quote
        ? `<p style="margin:0 0 24px;color:#eeeff4;font-size:14px;line-height:1.6;white-space:pre-wrap">“${escapeHtml(quote)}”</p>`
        : ""
    }
    <a href="${adminUrl}" style="display:inline-block;color:#0b0c11;background:#eeeff4;text-decoration:none;font-size:13px;font-weight:600;padding:10px 18px;border-radius:8px">Review it</a>
  </div>
</div>`;

  return sendEmail(
    { to, subject: `New review — ${name} (${rating}/5)`, html },
    "reviews",
  );
}
