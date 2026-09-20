import Image from "next/image";
import type { Dictionary } from "@/i18n";
import { Section } from "@/components/ui/Section";
import { builtProjectIds, type ProjectId } from "@/content/services";

/**
 * Drawn per project in that project's own palette, not stock photography and
 * not a screenshot. A stock photo of a stranger's mouth says nothing about
 * what was built, and a screenshot shrunk to a thumbnail is unreadable; an
 * illustration can show the one thing the demo is actually about.
 */
const THUMBS: Partial<Record<ProjectId, string>> = {
  dental: "/work/root-bloom.svg",
};

/**
 * There is no client work yet, so the first real things to show are demo
 * builds at /demo/<id> — each a genuinely separate brand (own layout, fonts,
 * palette; see that route's own files) rather than a screenshot glued onto
 * this page.
 *
 * Nothing renders while builtProjectIds is empty — only the "more on the way"
 * line below. Add the id here and to builtProjectIds when a demo ships.
 */
export function Work({ t }: { t: Dictionary }) {
  return (
    <Section
      id="work"
      tone="ember"
      eyebrow={t.work.eyebrow}
      title={t.work.title}
      intro={t.work.intro}
    >
      <div data-reveal-group className="grid gap-6 md:grid-cols-2">
        {builtProjectIds.map((id) => {
          const project = t.work.projects[id];
          if (!project) return null;
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
                  /* The tiles are SVG, which the image optimiser refuses to
                     touch unless dangerouslyAllowSVG is set. They are ours and
                     a few KB each, so there is nothing to optimise anyway. */
                  unoptimized
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