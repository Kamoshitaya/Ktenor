"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Stars } from "@/components/reviews/Stars";

type Review = {
  id: string;
  name: string;
  role: string | null;
  rating: number;
  quote: string | null;
  locale: string;
  status: "pending" | "approved" | "rejected";
  source: "visitor" | "owner";
  createdAt: string;
};

async function api(input: string, init?: RequestInit) {
  const response = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (response.status === 401) {
    window.location.reload();
    throw new Error("unauthorized");
  }
  return response;
}

export function AdminReviewsClient() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [error, setError] = useState(false);

  async function load() {
    setError(false);
    try {
      const response = await api("/api/admin/reviews");
      const data = await response.json();
      if (!data.ok) throw new Error("failed");
      setReviews(data.reviews);
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  const pending = reviews?.filter((r) => r.status === "pending") ?? [];
  const rest = reviews?.filter((r) => r.status !== "pending") ?? [];

  return (
    <div className="container-page py-12">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[length:var(--text-h2)]">Reviews</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {reviews ? `${pending.length} pending · ${reviews.length} total` : "Loading…"}
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="cursor-pointer rounded-[var(--radius-sm)] border border-line-strong px-4 py-2.5 text-sm text-text-secondary transition-colors hover:text-text"
        >
          Log out
        </button>
      </div>

      <AddReviewForm onAdded={load} />

      {error ? (
        <p className="mt-8 text-danger">Could not load reviews. <button className="underline" onClick={load}>Retry</button></p>
      ) : null}

      {reviews && pending.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-[length:var(--text-h3)]">Pending</h2>
          <ul className="mt-4 grid gap-4">
            {pending.map((r) => (
              <ReviewRow key={r.id} review={r} onChanged={load} />
            ))}
          </ul>
        </section>
      ) : null}

      {reviews && rest.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-[length:var(--text-h3)]">Approved & rejected</h2>
          <ul className="mt-4 grid gap-4">
            {rest.map((r) => (
              <ReviewRow key={r.id} review={r} onChanged={load} />
            ))}
          </ul>
        </section>
      ) : null}

      {reviews && reviews.length === 0 ? (
        <p className="mt-10 text-text-secondary">No reviews yet.</p>
      ) : null}
    </div>
  );
}

function AddReviewForm({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    try {
      await api("/api/admin/reviews", {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), rating, quote: quote.trim(), locale: "sk" }),
      });
      setName("");
      setRating(5);
      setQuote("");
      setOpen(false);
      onAdded();
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-8 cursor-pointer rounded-[var(--radius-sm)] border border-line-strong px-4 py-2.5 text-sm text-text-secondary transition-colors hover:text-text"
      >
        + Add a review manually
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="surface mt-8 grid gap-4 rounded-[var(--radius-md)] p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          autoFocus
          className="rounded-[var(--radius-sm)] border border-line-strong bg-bg-raised px-3 py-2.5 text-sm text-text outline-none focus-visible:border-accent"
        />
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="rounded-[var(--radius-sm)] border border-line-strong bg-bg-raised px-3 py-2.5 text-sm text-text outline-none focus-visible:border-accent"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} / 5
            </option>
          ))}
        </select>
      </div>
      <textarea
        value={quote}
        onChange={(e) => setQuote(e.target.value)}
        placeholder="Quote (optional)"
        rows={2}
        className="rounded-[var(--radius-sm)] border border-line-strong bg-bg-raised px-3 py-2.5 text-sm text-text outline-none focus-visible:border-accent"
      />
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy || !name.trim()}
          className="cursor-pointer rounded-[var(--radius-sm)] bg-text px-5 py-2.5 text-sm font-medium text-bg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Adding…" : "Publish immediately"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="cursor-pointer text-sm text-text-muted hover:text-text-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function ReviewRow({ review, onChanged }: { review: Review; onChanged: () => void }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(review.name);
  const [rating, setRating] = useState(review.rating);
  const [quote, setQuote] = useState(review.quote ?? "");
  const [busy, setBusy] = useState(false);

  async function patch(body: Record<string, unknown>) {
    setBusy(true);
    try {
      await api(`/api/admin/reviews/${review.id}`, { method: "PATCH", body: JSON.stringify(body) });
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    await patch({ name: name.trim(), rating, quote: quote.trim() });
    setEditing(false);
  }

  async function remove() {
    if (!confirm(`Delete this review from ${review.name}? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await api(`/api/admin/reviews/${review.id}`, { method: "DELETE" });
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  const statusColor =
    review.status === "approved"
      ? "text-accent"
      : review.status === "rejected"
        ? "text-danger"
        : "text-text-muted";

  return (
    <li className="surface rounded-[var(--radius-md)] p-5">
      {editing ? (
        <div className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-[var(--radius-sm)] border border-line-strong bg-bg-raised px-3 py-2 text-sm text-text outline-none focus-visible:border-accent"
            />
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="rounded-[var(--radius-sm)] border border-line-strong bg-bg-raised px-3 py-2 text-sm text-text outline-none focus-visible:border-accent"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} / 5
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            rows={2}
            className="rounded-[var(--radius-sm)] border border-line-strong bg-bg-raised px-3 py-2 text-sm text-text outline-none focus-visible:border-accent"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className="cursor-pointer rounded-[var(--radius-xs)] bg-text px-4 py-2 text-xs font-medium text-bg disabled:opacity-50"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="cursor-pointer text-xs text-text-muted hover:text-text-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-text">{review.name}</span>
                <span className={`text-caption uppercase tracking-[0.1em] ${statusColor}`}>
                  {review.status}
                </span>
                {review.source === "owner" ? (
                  <span className="text-caption text-text-muted">manual</span>
                ) : null}
              </div>
              <div className="mt-1.5">
                <Stars rating={review.rating} size={14} />
              </div>
            </div>
            <span className="text-caption text-text-muted">
              {new Date(review.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {review.quote ? (
            <p className="mt-3 text-sm text-text-secondary">“{review.quote}”</p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            {review.status !== "approved" ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => patch({ status: "approved" })}
                className="cursor-pointer rounded-[var(--radius-xs)] bg-text px-3.5 py-2 text-xs font-medium text-bg disabled:opacity-50"
              >
                Approve
              </button>
            ) : null}
            {review.status !== "rejected" ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => patch({ status: "rejected" })}
                className="cursor-pointer rounded-[var(--radius-xs)] border border-line-strong px-3.5 py-2 text-xs text-text-secondary transition-colors hover:text-text disabled:opacity-50"
              >
                Reject
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="cursor-pointer rounded-[var(--radius-xs)] border border-line-strong px-3.5 py-2 text-xs text-text-secondary transition-colors hover:text-text"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={remove}
              disabled={busy}
              className="cursor-pointer rounded-[var(--radius-xs)] px-3.5 py-2 text-xs text-danger disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}
