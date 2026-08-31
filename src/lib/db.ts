import { neon } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";

/**
 * Provisioning Postgres storage from Vercel's dashboard (Storage → Marketplace
 * → Neon) auto-injects `DATABASE_URL`; `POSTGRES_URL` is kept as a fallback
 * for the older env var name some integrations still use.
 */
function connectionString(): string {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) {
    throw new Error(
      "No database connection string found — set DATABASE_URL (or POSTGRES_URL) after provisioning Postgres storage in Vercel.",
    );
  }
  return url;
}

// `fullResults: true` makes every call resolve to `{ rows, rowCount, ... }`
// instead of Neon's default of just the row array — kept so call sites below
// can destructure `{ rows }` and read `rowCount` the same way throughout.
let client: ReturnType<typeof neon<false, true>> | null = null;
function sql<T = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<{ rows: T[]; rowCount: number | null }> {
  if (!client) client = neon(connectionString(), { fullResults: true });
  return client(strings, ...values) as Promise<{ rows: T[]; rowCount: number | null }>;
}

export type ReviewStatus = "pending" | "approved" | "rejected";
export type ReviewSource = "visitor" | "owner";

export type Review = {
  id: string;
  name: string;
  role: string | null;
  rating: number;
  quote: string | null;
  locale: string;
  status: ReviewStatus;
  source: ReviewSource;
  createdAt: string;
  updatedAt: string;
};

type ReviewRow = {
  id: string;
  name: string;
  role: string | null;
  rating: number;
  quote: string | null;
  locale: string;
  status: ReviewStatus;
  source: ReviewSource;
  created_at: Date | string;
  updated_at: Date | string;
};

function toReview(row: ReviewRow): Review {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    rating: row.rating,
    quote: row.quote,
    locale: row.locale,
    status: row.status,
    source: row.source,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

/**
 * Runs once per warm serverless instance rather than on every call — the
 * statement is idempotent either way, this just avoids repeating a DDL round
 * trip on every request when it can only ever do something on the first one.
 */
let schemaReady: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT,
        email TEXT,
        rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        quote TEXT,
        locale TEXT NOT NULL DEFAULT 'sk',
        status TEXT NOT NULL DEFAULT 'pending'
          CHECK (status IN ('pending', 'approved', 'rejected')),
        source TEXT NOT NULL DEFAULT 'visitor'
          CHECK (source IN ('visitor', 'owner')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `.then(() => undefined);
  }
  // TS loses the narrowing from the block above across the intervening
  // function call inside it — the assignment is unconditional up here.
  return schemaReady!;
}

export type NewReview = {
  name: string;
  role: string | null;
  email: string | null;
  rating: number;
  quote: string | null;
  locale: string;
};

async function insert(input: NewReview, status: ReviewStatus, source: ReviewSource) {
  await ensureSchema();
  const id = randomUUID();
  const { rows } = await sql<ReviewRow>`
    INSERT INTO reviews (id, name, role, email, rating, quote, locale, status, source)
    VALUES (${id}, ${input.name}, ${input.role}, ${input.email}, ${input.rating},
            ${input.quote}, ${input.locale}, ${status}, ${source})
    RETURNING id, name, role, rating, quote, locale, status, source, created_at, updated_at
  `;
  return toReview(rows[0]);
}

/** A visitor's own submission — always starts pending, never skips review. */
export function insertVisitorReview(input: NewReview) {
  return insert(input, "pending", "visitor");
}

/** The owner adding one directly from the admin page — published immediately. */
export function insertOwnerReview(input: NewReview) {
  return insert(input, "approved", "owner");
}

export async function listApprovedReviews(limit?: number): Promise<Review[]> {
  await ensureSchema();
  const { rows } = limit
    ? await sql<ReviewRow>`
        SELECT id, name, role, rating, quote, locale, status, source, created_at, updated_at
        FROM reviews WHERE status = 'approved'
        ORDER BY created_at DESC LIMIT ${limit}
      `
    : await sql<ReviewRow>`
        SELECT id, name, role, rating, quote, locale, status, source, created_at, updated_at
        FROM reviews WHERE status = 'approved'
        ORDER BY created_at DESC
      `;
  return rows.map(toReview);
}

export async function countApprovedReviews(): Promise<number> {
  await ensureSchema();
  const { rows } = await sql<{ count: string }>`
    SELECT count(*)::text AS count FROM reviews WHERE status = 'approved'
  `;
  return Number(rows[0]?.count ?? 0);
}

/** Admin view: everything, pending first so it cannot be missed, then newest. */
export async function listAllReviews(): Promise<Review[]> {
  await ensureSchema();
  const { rows } = await sql<ReviewRow>`
    SELECT id, name, role, rating, quote, locale, status, source, created_at, updated_at
    FROM reviews
    ORDER BY (status = 'pending') DESC, created_at DESC
  `;
  return rows.map(toReview);
}

export type ReviewPatch = Partial<{
  name: string;
  role: string | null;
  rating: number;
  quote: string | null;
  status: ReviewStatus;
}>;

export async function updateReview(id: string, patch: ReviewPatch): Promise<Review | null> {
  await ensureSchema();
  const { rows } = await sql<ReviewRow>`
    UPDATE reviews SET
      name = COALESCE(${patch.name ?? null}, name),
      role = CASE WHEN ${patch.role !== undefined} THEN ${patch.role} ELSE role END,
      rating = COALESCE(${patch.rating ?? null}, rating),
      quote = CASE WHEN ${patch.quote !== undefined} THEN ${patch.quote} ELSE quote END,
      status = COALESCE(${patch.status ?? null}, status),
      updated_at = now()
    WHERE id = ${id}
    RETURNING id, name, role, rating, quote, locale, status, source, created_at, updated_at
  `;
  return rows[0] ? toReview(rows[0]) : null;
}

export async function deleteReview(id: string): Promise<boolean> {
  await ensureSchema();
  const { rowCount } = await sql`DELETE FROM reviews WHERE id = ${id}`;
  return (rowCount ?? 0) > 0;
}
