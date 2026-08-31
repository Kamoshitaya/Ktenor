/**
 * Ktenor mark — rebuilt by hand from the source artwork.
 *
 * Geometry was measured off the original raster (stem, arm, leg, notch, bars,
 * dot) rather than eyeballed, so the vector matches the brand exactly. Two
 * deliberate corrections were agreed with the owner:
 *   - the bars sit on the K baseline instead of hanging below it
 *   - the blue is muted from the original royal tone to steel
 *
 * The K uses `currentColor`, so it follows the surrounding text colour and
 * works in both themes without a second asset.
 */

type LogoProps = {
  /** `mark` = K + bars + dot. `compact` = K + dot, for small sizes. */
  variant?: "mark" | "compact";
  className?: string;
  style?: React.CSSProperties;
  /** Omit for decorative use next to a visible wordmark. */
  title?: string;
} & React.SVGProps<SVGSVGElement>;

export function Logo({ variant = "mark", className, style, title, ...rest }: LogoProps) {
  const showBars = variant === "mark";

  return (
    <svg
      viewBox="0 0 272 299"
      fill="none"
      className={className}
      style={style}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      {...rest}
    >
      {title ? <title>{title}</title> : null}

      {/* Stem */}
      <path d="M0 0h41v299H0z" fill="currentColor" />
      {/* Upper arm — flat top cut, angled foot into the stem */}
      <path d="M187 0h57L75 173l-33-16z" fill="currentColor" />
      {/* Lower leg — detached from the stem, forming the notch */}
      <path d="M118 161l130 138h-59L79 182z" fill="currentColor" />

      {showBars ? (
        <g>
          <rect x="156" y="265" width="21" height="34" rx="4" fill="var(--c-accent)" />
          <rect x="183" y="265" width="21" height="34" rx="4" fill="var(--c-accent-mid)" />
          <rect x="210" y="265" width="21" height="34" rx="4" fill="var(--c-accent-deep)" />
        </g>
      ) : null}

      <circle cx="263.5" cy="263" r="8.5" fill="var(--c-accent)" />
    </svg>
  );
}

/** Mark + wordmark. The wordmark is Clash Display, not a drawn asset. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-[0.55em] ${className ?? ""}`}>
      <Logo className="h-[1em] w-auto translate-y-[0.08em]" />
      <span
        className="font-display font-medium uppercase leading-none"
        style={{ letterSpacing: "0.16em" }}
      >
        Ktenor
      </span>
    </span>
  );
}
