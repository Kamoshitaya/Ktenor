import { Stars } from "./Stars";

export type DisplayReview = {
  id: string;
  name: string;
  rating: number;
  quote: string | null;
  createdAt: string;
};

/**
 * Stars first, name, then — only if the visitor bothered to write one — a
 * short line underneath in a quieter size. Matches the shape the owner asked
 * for: the rating carries the card, the text is a bonus, not a requirement.
 */
export function ReviewCard({ review, reveal }: { review: DisplayReview; reveal?: boolean }) {
  return (
    <figure
      data-reveal={reveal ? "" : undefined}
      className="surface surface-hover flex h-full flex-col rounded-[var(--radius-lg)] p-7"
    >
      <Stars rating={review.rating} />
      <figcaption className="mt-4 text-sm font-medium text-text">{review.name}</figcaption>
      {review.quote ? (
        <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">
          “{review.quote}”
        </blockquote>
      ) : null}
    </figure>
  );
}
