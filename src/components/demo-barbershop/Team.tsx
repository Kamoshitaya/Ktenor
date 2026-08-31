import Image from "next/image";
import { team } from "@/content/demo-barbershop/team";
import { BladeMark } from "./BladeMark";

export function Team() {
  return (
    <section id="team" className="relative isolate py-20 md:py-28">
      <div className="section-wash" data-tone="copper" aria-hidden />
      <div className="container-page relative z-[1]">
        <header data-reveal className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-copper">
            Behind the chairs
          </p>
          <h2 className="mt-3 font-display text-[clamp(2.2rem,4vw,3rem)] uppercase leading-tight text-ivory">
            Four pairs of hands.
          </h2>
          <p className="mt-3 text-sm text-ivory-muted">
            Pick a barber or let us match you — everyone works to the same standard.
          </p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((b) => (
            <article key={b.name} data-reveal className="card-hover overflow-hidden rounded-lg">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg">
                <Image
                  src={b.photo}
                  alt={b.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover grayscale"
                />
                <span className="absolute left-2.5 top-2.5 rounded-sm bg-charcoal-deep/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-copper">
                  {b.years} yrs experience
                </span>
                <span className="absolute right-2.5 top-2.5 grid size-7 place-items-center rounded-full bg-charcoal-deep/80 text-copper">
                  <BladeMark className="size-3.5" />
                </span>
              </div>
              <div className="pt-4">
                <h3 className="font-display text-[1.05rem] text-ivory">{b.name}</h3>
                <p className="mt-0.5 text-xs uppercase tracking-[0.1em] text-copper">{b.role}</p>
                <span className="mt-3 block h-px w-8 bg-copper/60" />
                <p className="mt-3 text-sm leading-relaxed text-ivory-muted">{b.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
