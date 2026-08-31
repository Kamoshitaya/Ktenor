import Image from "next/image";
import type { Dictionary } from "@/i18n";
import { Section } from "@/components/ui/Section";
import { builtProjectIds, type ProjectId } from "@/content/services";

const THUMBS: Partial<Record<ProjectId, string>> = {
  cafe: "https://images.unsplash.com/photo-1605088576635-db443afdcab5?q=80&w=1200&auto=format&fit=crop",
  barbershop:
    "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1200&auto=format&fit=crop",
};

/**
 * There is no client work yet, so the first real things to show are demo
 * builds at /demo/<id> — each a genuinely separate brand (own layout, fonts,
 * palette; see that route's own files) rather than a screenshot glued onto
 * this page.
 */
export function Work({ t }: { t: Dictionary }) {
  return (
    <Section id="work" eyebrow={t.work.eyebrow} title={t.work.title} intro={t.work.intro}>
      <div data-reveal-group className="grid gap-6 md:grid-cols-2">
        {builtProjectIds.map((id) => {
          const project = t.work.projects[id];
          return (
            <a
              key={id}
              href={`/demo/${id}`}
              className="surface surface-hover group flex flex-col overflow-hidden rounded-[var(--radius-lg)]"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={THUMBS[id]!}
                  alt={project.name}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[var(--dur-slower)] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                />
              </div>

              <div className="flex flex-1 flex-col justify-center p-7 sm:p-9">
                <span className="text-caption uppercase tracking-[0.2em] text-text-muted">
                  Demo project
                </span>
                <h3 className="mt-3 font-display text-[length:var(--text-h3)]">{project.name}</h3>
                <p className="mt-3 text-text-secondary">{project.description}</p>
                <span className="link-rule mt-5 inline-flex w-fit items-center gap-2 text-sm font-medium text-accent">
                  {project.cta}
                  <svg aria-hidden viewBox="0 0 16 16" width="14" height="14" fill="none">
                    <path
                      d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </a>
          );
        })}
      </div>

      <p data-reveal className="mt-6 text-center text-sm text-text-muted">
        {t.work.comingSoon}
      </p>
    </Section>
  );
}
