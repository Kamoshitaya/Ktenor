import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/admin-auth";
import { insertOwnerReview, listAllReviews } from "@/lib/db";
import { clean, validateReview, LIMITS, type ReviewInput } from "@/lib/review";
import { revalidateReviewPages } from "@/lib/revalidate-reviews";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const reviews = await listAllReviews();
  return NextResponse.json({ ok: true, reviews });
}

/** The owner adding a review directly — published immediately, no queue. */
export async function POST(request: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: Partial<ReviewInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "malformed" }, { status: 400 });
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

  const saved = await insertOwnerReview({
    name: input.name,
    role: null,
    email: null,
    rating: input.rating,
    quote: input.quote ?? null,
    locale: input.locale,
  });

  revalidateReviewPages();
  return NextResponse.json({ ok: true, review: saved });
}
