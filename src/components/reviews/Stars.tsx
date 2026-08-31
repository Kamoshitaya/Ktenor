/**
 * Read-only star display. A plain SVG path, not an icon-font glyph or emoji —
 * consistent stroke, scales cleanly, themes with currentColor/fill tokens.
 */
const STAR_PATH =
  "M10 1.6l2.47 5.15 5.53.8-4 4.03.94 5.72L10 14.6l-4.94 2.7.94-5.72-4-4.03 5.53-.8L10 1.6z";

export function Stars({
  rating,
  size = 16,
  label,
}: {
  rating: number;
  size?: number;
  label?: string;
}) {
  return (
    <span
      role="img"
      aria-label={label ?? `${rating} / 5`}
      className="inline-flex items-center gap-1"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          aria-hidden
          viewBox="0 0 20 20"
          width={size}
          height={size}
          className={n <= rating ? "text-accent" : "text-line-strong"}
        >
          <path d={STAR_PATH} fill="currentColor" />
        </svg>
      ))}
    </span>
  );
}
