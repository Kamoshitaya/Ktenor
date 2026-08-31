import Image from "next/image";
import { gallery } from "@/content/demo-barbershop/gallery";

export function Gallery() {
  const shown = gallery.slice(0, 6);

  return (
    <section id="gallery" className="relative isolate bg-[var(--charcoal-raised)] py-20 md:py-28">
      <div className="section-wash" data-tone="brass" aria-hidden />
      <div className="container-page relative z-[1]">
        <header data-reveal className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-copper">The work</p>
          <h2 className="mt-3 font-display text-[clamp(2.2rem,4vw,3rem)] uppercase leading-tight text-ivory">
            Cuts, beards, brick.
          </h2>
          <p className="mt-3 text-sm text-ivory-muted">
            Shot on the floor, under our own copper lamps.
          </p>
        </header>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {shown.map((photo, i) => (
            <div
              key={photo.src}
              data-reveal
              className="relative overflow-hidden rounded-lg"
              style={{ aspectRatio: i % 3 === 1 ? "3 / 4" : "4 / 5" }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 768px) 33vw, 50vw"
                className="gallery-photo object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 font-display text-xs uppercase tracking-[0.1em] text-copper">
                — {String(i * 2 + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
