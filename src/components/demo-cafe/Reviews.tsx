import { reviews } from "@/content/demo-cafe/reviews";
import { BeanMark } from "./BeanMark";

export function Reviews() {
  return (
    <section id="reviews" className="relative isolate py-20 md:py-28">
      <div className="section-wash" data-tone="terracotta" aria-hidden />
      <div className="container-page relative z-[1]">
        <header data-reveal className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-terracotta">Guests</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.1] text-ink">
            Said over the second cup.
          </h2>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <figure
              key={r.name}
              data-reveal
              className="card-hover rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-6"
            >
              <BeanMark className="size-4 text-terracotta" />
              <blockquote className="mt-4 text-[0.95rem] leading-relaxed text-ink-soft">
                {r.text}
              </blockquote>
              <div className="mt-5 border-t border-[var(--line)] pt-4">
                <figcaption className="text-sm font-semibold text-ink">{r.name}</figcaption>
                <p className="mt-0.5 text-xs text-ink-muted">{r.tag}</p>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
