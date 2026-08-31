"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { Button } from "@/components/ui/Button";
import { LIMITS } from "@/lib/review";
import { StarInput } from "./StarInput";

type Errors = Partial<Record<"name" | "rating", string>>;
type Status = "idle" | "sending" | "sent" | "failed";

/**
 * Same shape as the contact form: validate locally for instant feedback, let
 * the server re-validate because nothing arriving over the network is
 * trusted, never claim success unless the review actually reached storage.
 */
export function ReviewForm({ t, locale }: { t: Dictionary; locale: Locale }) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef(Date.now());
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [quote, setQuote] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [messageVisible, setMessageVisible] = useState(false);

  // Mirrors the mobile menu's own toggle pattern: mount in the "hidden"
  // position first, then flip a frame later so the transition actually runs
  // instead of snapping straight to its end state.
  useEffect(() => {
    if (status !== "sent" && status !== "failed") {
      setMessageVisible(false);
      return;
    }
    setMessageVisible(false);
    const timer = setTimeout(() => setMessageVisible(true), 0);
    return () => clearTimeout(timer);
  }, [status]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const next: Errors = {};
    if (!name.trim()) next.name = t.reviews.errors.name;
    if (rating < 1 || rating > 5) next.rating = t.reviews.errors.rating;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const company = new FormData(formRef.current ?? undefined).get("company");

    setStatus("sending");
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          rating,
          quote: quote.trim(),
          locale,
          company: String(company ?? ""),
          startedAt: startedAt.current,
        }),
      });

      if (!response.ok) {
        setStatus("failed");
        return;
      }

      setName("");
      setRating(0);
      setQuote("");
      setConsent(false);
      startedAt.current = Date.now();
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div className="surface rounded-[var(--radius-lg)] p-7 sm:p-9">
      <h3 className="text-[length:var(--text-h3)]">{t.reviews.formTitle}</h3>
      <p className="mt-2 text-sm text-text-secondary">{t.reviews.formIntro}</p>

      <form ref={formRef} noValidate onSubmit={onSubmit} className="mt-7 grid gap-6">
        {/* Bot trap — same pattern as the contact form. */}
        <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
          <label htmlFor={`${uid}-company`}>Company</label>
          <input id={`${uid}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div>
          <span className="text-sm text-text-secondary">
            {t.reviews.fields.rating}{" "}
            <span className="text-caption text-text-muted">({t.reviews.fields.required})</span>
          </span>
          <div className="mt-2">
            <StarInput
              value={rating}
              onChange={(n) => {
                setRating(n);
                setErrors((e) => ({ ...e, rating: undefined }));
              }}
              labelFor={(n) => `${n} / 5`}
              invalid={!!errors.rating}
            />
          </div>
          {errors.rating ? (
            <p role="alert" className="mt-2 text-caption text-danger">
              {errors.rating}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${uid}-name`} className="flex items-baseline gap-2 text-sm text-text-secondary">
            {t.reviews.fields.name}
            <span className="text-caption text-text-muted">({t.reviews.fields.required})</span>
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.reviews.fields.namePlaceholder}
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? `${uid}-name-error` : undefined}
            className={`mt-2 w-full rounded-[var(--radius-sm)] border bg-bg-raised px-4 py-3.5 text-body text-text outline-none transition-[border-color] duration-[var(--dur-base)] placeholder:text-text-muted focus-visible:border-accent ${
              errors.name ? "border-[var(--c-danger-border)]" : "border-line-strong"
            }`}
          />
          {errors.name ? (
            <p id={`${uid}-name-error`} role="alert" className="mt-2 text-caption text-danger">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor={`${uid}-quote`} className="flex items-baseline gap-2 text-sm text-text-secondary">
              {t.reviews.fields.quote}
              <span className="text-caption text-text-muted">({t.reviews.fields.optional})</span>
            </label>
            <span className="text-caption tabular-nums text-text-muted">
              {quote.length}/{LIMITS.quote}
            </span>
          </div>
          <textarea
            id={`${uid}-quote`}
            name="quote"
            rows={3}
            value={quote}
            onChange={(e) => setQuote(e.target.value.slice(0, LIMITS.quote))}
            placeholder={t.reviews.fields.quotePlaceholder}
            maxLength={LIMITS.quote}
            className="mt-2 w-full resize-y rounded-[var(--radius-sm)] border border-line-strong bg-bg-raised px-4 py-3.5 text-body text-text outline-none transition-[border-color] duration-[var(--dur-base)] placeholder:text-text-muted focus-visible:border-accent"
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[var(--c-accent)]"
          />
          <span>
            {t.reviews.consent.label}{" "}
            <a href={`/${locale}/privacy`} className="text-accent underline underline-offset-4">
              {t.reviews.consent.link}
            </a>
          </span>
        </label>

        <div className="grid gap-5">
          <Button type="submit" block disabled={status === "sending"}>
            {status === "sending" ? (
              <svg aria-hidden viewBox="0 0 24 24" fill="none" className="size-4 animate-spin">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            ) : null}
            {status === "sending" ? t.reviews.sending : t.reviews.submit}
          </Button>

          <div aria-live="polite" aria-atomic="true">
            {status === "sent" ? (
              <div
                className={`surface rounded-[var(--radius-md)] p-5 transition-[opacity,transform] duration-[var(--dur-slow)] ease-[var(--ease-out-expo)] ${
                  messageVisible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                }`}
              >
                <p className="flex items-center gap-2.5 text-sm font-medium">
                  <span aria-hidden className="flex gap-1">
                    <span className="h-4 w-1 rounded-full bg-accent" />
                    <span className="h-4 w-1 rounded-full bg-accent-mid" />
                    <span className="h-4 w-1 rounded-full bg-accent" />
                  </span>
                  {t.reviews.success.title}
                </p>
                <p className="mt-2 text-sm text-text-secondary">{t.reviews.success.body}</p>
              </div>
            ) : null}

            {status === "failed" ? (
              <div
                className={`rounded-[var(--radius-md)] border border-[var(--c-danger-border)] bg-[var(--c-danger-bg)] p-5 transition-[opacity,transform] duration-[var(--dur-slow)] ease-[var(--ease-out-expo)] ${
                  messageVisible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                }`}
              >
                <p className="text-sm font-medium text-[var(--c-danger)]">
                  {t.reviews.failure.title}
                </p>
                <p className="mt-2 text-sm text-text-secondary">{t.reviews.failure.body}</p>
              </div>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
}
