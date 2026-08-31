import type { Dictionary } from "@/i18n";
import { advantageIds } from "@/content/services";
import { Section } from "@/components/ui/Section";

export function Advantages({ t }: { t: Dictionary }) {
  return (
    <Section
      eyebrow={t.advantages.eyebrow}
      title={t.advantages.title}
      intro={t.advantages.intro}
    >
      <ul data-reveal-group className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {advantageIds.map((id) => {
          const item = t.advantages.items[id];
          return (
            <li key={id}>
              <article className="surface surface-hover h-full rounded-[var(--radius-lg)] p-7">
                <span aria-hidden className="flex gap-1">
                  <span className="h-4 w-[3px] rounded-full bg-accent" />
                  <span className="h-4 w-[3px] rounded-full bg-accent-mid" />
                  <span className="h-4 w-[3px] rounded-full bg-accent-deep" />
                </span>
                <h3 className="mt-6 text-[length:var(--text-h3)]">{item.name}</h3>
                <p className="mt-3 text-text-secondary">{item.description}</p>
              </article>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
