type Props = {
  id?: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
  className?: string;
  /** Alternates down the page so the ambient tone shifts as you read. */
  tone?: "cool" | "warm";
};

/**
 * One rhythm for every section: same vertical space, same header block,
 * same measure on the intro. Consistency here is what stops a long page
 * from feeling assembled out of parts.
 */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
  tone = "cool",
}: Props) {
  return (
    <section
      id={id}
      className={`section-seam relative isolate scroll-mt-[72px] py-[var(--spacing-section)] ${className ?? ""}`}
    >
      <div aria-hidden className="section-wash" data-tone={tone} />
      <div className="container-page">
        <header data-reveal className="max-w-[62ch]">
          <p className="flex items-center gap-3 text-caption uppercase tracking-[0.24em] text-text-muted">
            <span aria-hidden className="flex gap-[3px]">
              <span className="h-3 w-[3px] rounded-full bg-accent" />
              <span className="h-3 w-[3px] rounded-full bg-accent-mid" />
              <span className="h-3 w-[3px] rounded-full bg-accent-deep" />
            </span>
            {eyebrow}
          </p>
          <h2 className="mt-5 text-[length:var(--text-h1)]">{title}</h2>
          {intro ? (
            <p className="mt-6 text-[length:var(--text-lead)] text-text-secondary">
              {intro}
            </p>
          ) : null}
        </header>

        <div className="mt-[var(--spacing-block)]">{children}</div>
      </div>
    </section>
  );
}
