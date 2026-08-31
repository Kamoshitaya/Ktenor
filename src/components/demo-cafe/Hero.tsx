import { BeanMark } from "./BeanMark";

const stats = [
  { value: "Roasted in-house", label: "Weekly micro-lots" },
  { value: "Breakfast till 15:00", label: "Every single day" },
  { value: "Baked at dawn", label: "Sold out by dusk" },
];

export function Hero() {
  return (
    <>
      <section
        id="top"
        className="stone-slab grain relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-6 py-28 text-center sm:px-10"
      >
        <div className="relative mx-auto flex max-w-2xl flex-col items-center">
          <span className="inline-flex items-center gap-2 rounded-sm border border-[var(--cream)]/35 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cream)]/85">
            Bratislava · Old Town · Est. 2019
          </span>

          <BeanMark className="mt-6 size-10 text-[var(--cream)]/85" />
          <h1 className="mt-5 font-display text-[clamp(2.6rem,6vw,4.6rem)] leading-[1.05] text-[var(--cream)]">
            Ember &amp; Oak
          </h1>
          <p className="mt-5 max-w-md text-balance text-[1.05rem] leading-relaxed text-[var(--cream)]/80">
            A quiet corner of Staré Mesto for slow mornings, honest coffee and
            pastry worth crossing town for.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-6">
            <a
              href="#menu"
              className="rounded-sm bg-[var(--cream)] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.06em] text-ink transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-10px_rgba(0,0,0,0.5)]"
            >
              See the menu
            </a>
            <a
              href="#room"
              className="text-sm font-semibold uppercase tracking-[0.06em] text-[var(--cream)]/85 underline decoration-[var(--cream)]/40 underline-offset-[6px] transition-colors duration-300 hover:text-[var(--cream)] hover:decoration-[var(--cream)]"
            >
              Step inside
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--line-soft)] bg-[var(--paper)] py-10">
        <div className="container-page grid grid-cols-1 gap-6 text-center sm:grid-cols-3 sm:text-left">
          {stats.map((s) => (
            <div key={s.label} data-reveal>
              <p className="font-display text-[1.2rem] text-ink">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.1em] text-ink-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
