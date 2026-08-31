import Link from "next/link";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { listApprovedReviews } from "@/lib/db";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ReviewCard } from "@/components/reviews/ReviewCard";

const TEASER_COUNT = 6;

/**
 * Reads straight from the database — no API round trip needed for a server
 * component. Falls back to the empty state on any failure (storage not
 * provisioned yet, a bad connection string) rather than breaking the
 * homepage over a section that was always meant to degrade gracefully.
 */
export async function Testimonials({ t, locale }: { t: Dictionary; locale: Locale }) {
  const reviews = await listApprovedReviews(TEASER_COUNT).catch(() => []);

  return (
    <Section eyebrow={t.testimonials.eyebrow} title={t.testimonials.title} intro={t.testimonials.intro}>
      {reviews.length > 0 ? (
        <>
          <ul data-reveal-group className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review) => (
              <li key={review.id}>
                <ReviewCard review={review} />
              </li>
            ))}
          </ul>
          <div data-reveal className="mt-10 flex justify-center">
            <Button href={`/${locale}/reviews`} variant="secondary">
              {t.testimonials.seeAll}
            </Button>
          </div>
        </>
      ) : (
        <article
          data-reveal
          className="surface relative overflow-hidden rounded-[var(--radius-lg)] px-7 py-14 text-center sm:px-14 sm:py-20"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(70% 100% at 50% 0%, var(--c-accent-deep), transparent 62%)",
            }}
          />
          <span aria-hidden className="relative mx-auto flex w-fit items-end gap-1.5">
            <span className="h-7 w-[5px] rounded-full bg-line-strong" />
            <span className="h-7 w-[5px] rounded-full bg-line-strong" />
            <span className="h-7 w-[5px] rounded-full bg-line-strong" />
          </span>
          <p className="relative mt-8 text-[length:var(--text-h2)]">{t.testimonials.emptyTitle}</p>
          <p className="relative mx-auto mt-4 max-w-[46ch] text-text-secondary">
            {t.testimonials.emptyBody}
          </p>
          <div className="relative mt-8">
            <Link
              href={`/${locale}/reviews`}
              className="text-sm font-medium text-accent underline-offset-4 hover:underline"
            >
              {t.testimonials.leaveReview}
            </Link>
          </div>
        </article>
      )}
    </Section>
  );
}
