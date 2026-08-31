import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/admin-auth";
import { deleteReview, updateReview, type ReviewPatch } from "@/lib/db";
import { clean, LIMITS } from "@/lib/review";
import { revalidateReviewPages } from "@/lib/revalidate-reviews";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ id: string }> };

/** Edit text/rating and/or move status — approve, reject, or correct a typo. */
export async function PATCH(request: Request, { params }: RouteParams) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "malformed" }, { status: 400 });
  }

  const patch: ReviewPatch = {};
  if (typeof body.name === "string") patch.name = clean(body.name, LIMITS.name);
  if (typeof body.rating === "number") {
    const rating = Math.round(body.rating);
    if (rating >= 1 && rating <= 5) patch.rating = rating;
  }
  if ("quote" in body) {
    const quote = clean(body.quote, LIMITS.quote);
    patch.quote = quote || null;
  }
  if (body.status === "pending" || body.status === "approved" || body.status === "rejected") {
    patch.status = body.status;
  }

  const updated = await updateReview(id, patch);
  if (!updated) return NextResponse.json({ ok: false }, { status: 404 });
  revalidateReviewPages();
  return NextResponse.json({ ok: true, review: updated });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = await params;
  const removed = await deleteReview(id);
  if (!removed) return NextResponse.json({ ok: false }, { status: 404 });
  revalidateReviewPages();
  return NextResponse.json({ ok: true });
}
