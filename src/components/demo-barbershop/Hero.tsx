import Image from "next/image";
import { BladeMark } from "./BladeMark";

const HERO_PHOTO =
  "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2400&auto=format&fit=crop";

const stats = [
  { value: "10+ yrs", label: "On Karpatská" },
  { value: "4", label: "Barbers on the floor" },
  { value: "40 min", label: "Average visit" },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-6 py-28 text-center sm:px-10"
    >
      <Image
        src={HERO_PHOTO}
        alt=""
        fill
        priority
        sizes="100vw"
        className="gallery-photo -z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(12,9,6,0.7),rgba(12,9,6,0.5)_45%,rgba(12,9,6,0.92))]" />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center">
        <span className="inline-flex items-center gap-2 rounded-sm border border-copper/40 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-copper">
          Est. 2015 · Bratislava
        </span>

        <BladeMark className="mt-6 size-9 text-copper" />
        <h1 className="mt-5 font-display text-[clamp(2.5rem,6vw,4.4rem)] uppercase leading-[1.05] text-ivory">
          Sharp steel,
          <br />
          <span className="text-copper">warm copper,</span>
          <br />
          honest cuts.
        </h1>
        <p className="mt-6 max-w-md text-balance text-[1.05rem] leading-relaxed text-ivory-soft">
          Precision fades, straight razor shaves and a chair that isn&apos;t
          rushing you out. Staré Mesto, Bratislava.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#booking"
            className="rounded-sm bg-copper px-7 py-3.5 text-sm font-semibold text-charcoal-deep transition-transform duration-300 hover:-translate-y-0.5"
          >
            Book a chair
          </a>
          <a
            href="#services"
            className="rounded-sm border border-ivory/25 px-7 py-3.5 text-sm font-semibold text-ivory transition-colors duration-300 hover:bg-ivory/10"
          >
            Prices
          </a>
        </div>

        <div className="mt-14 flex w-full max-w-md items-start justify-between border-t border-ivory/15 pt-8">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-[1.5rem] text-copper">{s.value}</p>
              <p className="mt-1 max-w-[9ch] text-xs uppercase leading-snug tracking-[0.06em] text-ivory-muted">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
