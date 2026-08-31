import type { Dictionary } from "@/i18n";
import { principleIds } from "@/content/services";
import { Section } from "@/components/ui/Section";

export function Principles({ t }: { t: Dictionary }) {
  return (
    <Section
      id="about"
      tone="warm"
      eyebrow={t.principles.eyebrow}
      title={t.principles.title}
      intro={t.principles.intro}
    >
      <ul data-reveal-group className="grid gap-x-12 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
        {principleIds.map((id) => {
          const item = t.principles.items[id];
          return (
            <li key={id} className="border-t border-line pt-6">
              <h3 className="text-[length:var(--text-h3)]">{item.name}</h3>
              <p className="mt-3 max-w-[42ch] text-text-secondary">{item.description}</p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
