import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { listApprovedReviews } from "@/lib/db";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ReviewForm } from "@/components/reviews/ReviewForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getDictionary(locale);
  return {
    title: `${t.reviews.title.replace(/\.$/, "")} — Ktenor`,
    description: t.reviews.intro,
    alternates: {
      canonical: `/${locale}/reviews`,
      languages: { sk: "/sk/reviews", en: "/en/reviews", "x-default": "/sk/reviews" },
    },
    robots: { index: true, follow: true },
  };
}

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = await getDictionary(locale);
  const reviews = await listApprovedReviews().catch(() => []);

  return (
    <article className="container-page py-[var(--spacing-section)]">
      <header data-reveal className="max-w-[62ch]">
        <p className="flex items-center gap-3 text-caption uppercase tracking-[0.24em] text-text-muted">
          <span aria-hidden className="flex gap-[3px]">
            <span className="h-3 w-[3px] rounded-full bg-accent" />
            <span className="h-3 w-[3px] rounded-full bg-accent-mid" />
            <span className="h-3 w-[3px] rounded-full bg-accent-deep" />
          </span>
          {t.testimonials.eyebrow}
        </p>
        <h1 className="mt-5 text-[length:var(--text-h1)]">{t.reviews.title}</h1>
        <p className="mt-6 text-[length:var(--text-lead)] text-text-secondary">{t.reviews.intro}</p>
      </header>

      <div className="mt-[var(--spacing-block)] grid gap-[var(--spacing-block)] lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        {reviews.length > 0 ? (
          <ul data-reveal-group className="grid gap-5 sm:grid-cols-2">
            {reviews.map((review) => (
              <li key={review.id}>
                <ReviewCard review={review} />
              </li>
            ))}
          </ul>
        ) : (
          <div
            data-reveal
            className="surface rounded-[var(--radius-lg)] px-7 py-14 text-center sm:px-14 sm:py-20"
          >
            <span aria-hidden className="mx-auto flex w-fit items-end gap-1.5">
              <span className="h-7 w-[5px] rounded-full bg-line-strong" />
              <span className="h-7 w-[5px] rounded-full bg-line-strong" />
              <span className="h-7 w-[5px] rounded-full bg-line-strong" />
            </span>
            <p className="mt-8 text-[length:var(--text-h3)]">{t.testimonials.emptyTitle}</p>
            <p className="mx-auto mt-3 max-w-[38ch] text-text-secondary">
              {t.testimonials.emptyBody}
            </p>
          </div>
        )}

        {/* No data-reveal here: it wraps client-component content elsewhere
            on the site only at the card/header level, never a whole
            interactive form — doing that here left the form stuck at
            opacity: 0, the reveal attribute set but the transition never
            resolving. The contact form has the same shape and is not
            reveal-wrapped either. */}
        <ReviewForm t={t} locale={locale as Locale} />
      </div>
    </article>
  );
}
