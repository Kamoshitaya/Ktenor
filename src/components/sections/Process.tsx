import type { Dictionary } from "@/i18n";
import { processIds, type ProcessId } from "@/content/services";
import { Section } from "@/components/ui/Section";

/** One line-icon per step, same stroke weight throughout — decorative, not informational. */
const STEP_ICON: Record<ProcessId, React.ReactNode> = {
  analysis: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-5-5" strokeLinecap="round" />
    </>
  ),
  planning: (
    <>
      <path d="M6 3.5h9L20 8.5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
      <path d="M14 3.5V8h5.5" strokeLinejoin="round" />
      <path d="M8.5 13h7M8.5 16.5h5" strokeLinecap="round" />
    </>
  ),
  design: (
    <>
      <path d="M4 20l1-4.5L15.5 5 19 8.5 8.5 19 4 20Z" strokeLinejoin="round" />
      <path d="M13 7l4 4" />
    </>
  ),
  development: (
    <>
      <path d="M9 8L4 12.5 9 17M15 8l5 4.5-5 4.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  testing: (
    <>
      <path d="M12 3.5l7 3v5.2c0 4.4-3 7.6-7 8.8-4-1.2-7-4.4-7-8.8V6.5l7-3Z" strokeLinejoin="round" />
      <path d="M9 12.3l2.1 2.1L15.5 10" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  launch: (
    <>
      <path d="M13.5 4.5c3 0 5.8 1.3 7 2.5-1.2 4-4 6.5-9 8.5l-4-4c2-5 4.5-7 6-7Z" strokeLinejoin="round" />
      <path d="M9 15l-4.5 4.5M7.5 12c-1.8 0-3.3.9-4 3.5 2.6-.7 3.5-2.2 3.5-4Z" strokeLinejoin="round" />
      <circle cx="14.8" cy="9.2" r="1.3" />
    </>
  ),
};

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
                  <span
                    aria-hidden
                    className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--surface-bg-hover)] text-accent"
                  >
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      {STEP_ICON[id]}
                    </svg>
                  </span>
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
