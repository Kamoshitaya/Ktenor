import type { Dictionary } from "@/i18n";
import { processIds } from "@/content/services";
import { Section } from "@/components/ui/Section";

/**
 * Compact until hovered on desktop. On touch there is no hover, so the cards
 * are simply open — tapping to reveal text costs the reader an action for
 * nothing. The description stays in the DOM either way, so screen readers and
 * search engines always see it.
 */
export function Process({ t }: { t: Dictionary }) {
  return (
    <Section
      id="process"
      eyebrow={t.process.eyebrow}
      title={t.process.title}
      intro={t.process.intro}
    >
      <ol data-reveal-group className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {processIds.map((id, index) => {
          const step = t.process.steps[id];
          return (
            <li key={id}>
              <article
                tabIndex={0}
                className="group surface surface-hover h-full rounded-[var(--radius-lg)] p-7 focus-visible:-translate-y-[2px]"
              >
                <div className="flex items-center gap-4">
                  <span className="font-display text-caption tabular text-text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden className="h-px flex-1 bg-line-strong" />
                  <span aria-hidden className="flex gap-[3px]">
                    {[0, 1, 2].map((bar) => (
                      <span
                        key={bar}
                        className="h-2.5 w-[3px] rounded-full transition-colors duration-[var(--dur-slow)]"
                        style={{
                          background:
                            bar <= index % 3 ? "var(--c-accent)" : "var(--c-line-strong)",
                        }}
                      />
                    ))}
                  </span>
                </div>

                <h3 className="mt-6 text-[length:var(--text-h3)]">{step.name}</h3>

                <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-[var(--dur-slower)] ease-[var(--ease-out-expo)] lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr] lg:group-focus-within:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <p className="pt-4 text-text-secondary">{step.description}</p>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ol>

      <p className="mt-8 hidden text-caption text-text-muted lg:block">{t.process.hint}</p>
    </Section>
  );
}
