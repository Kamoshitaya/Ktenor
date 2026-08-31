import Image from "next/image";
import { gallery } from "@/content/demo-cafe/gallery";

export function Gallery() {
  const [big1, big2, ...rest] = gallery;

  return (
    <section id="room" className="relative isolate bg-[var(--cream-deep)] py-20 md:py-28">
      <div className="section-wash" data-tone="gold" aria-hidden />
      <div className="container-page relative z-[1]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.3fr_1fr] md:items-end">
          <header data-reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-terracotta">
              The room
            </p>
            <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.1] text-ink">
              Lime plaster, fired clay, afternoon light.
            </h2>
          </header>
          <p data-reveal className="text-sm leading-relaxed text-ink-soft">
            Twenty-eight seats across two rooms on Zámocká. Built with a Bratislava
            ceramicist and a Modra joiner — everything you touch was made within an
            hour of here.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[big1, big2].map((photo) => (
            <div key={photo.src} data-reveal className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {rest.map((photo) => (
            <div key={photo.src} data-reveal className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
