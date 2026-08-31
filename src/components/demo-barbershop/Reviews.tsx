import { reviews } from "@/content/demo-barbershop/reviews";

export function Reviews() {
  return (
    <section id="reviews" className="relative isolate bg-[var(--charcoal-raised)] py-20 md:py-28">
      <div className="section-wash" data-tone="brass" aria-hidden />
      <div className="container-page relative z-[1]">
        <header data-reveal className="mx-auto max-w-xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-copper">Regulars say</p>
          <h2 className="mt-3 font-display text-[clamp(2.2rem,4vw,3rem)] uppercase leading-tight text-ivory">
            What the chair hears.
          </h2>
        </header>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r) => (
            <figure
              key={r.name}
              data-reveal
              className="card-hover rounded-lg border border-[var(--line)] bg-[var(--charcoal)] p-6"
            >
              <span aria-hidden className="font-display text-3xl leading-none text-copper">
                “
              </span>
              <blockquote className="mt-3 text-[0.92rem] leading-relaxed text-ivory-soft">
                {r.text}
              </blockquote>
              <div className="mt-5 border-t border-[var(--line)] pt-4">
                <figcaption className="text-sm font-semibold uppercase tracking-[0.05em] text-copper">
                  {r.name}
                </figcaption>
                <p className="mt-0.5 text-xs text-ivory-muted">{r.tag}</p>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
