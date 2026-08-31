import type { Dictionary } from "@/i18n";
import { faqIds } from "@/content/services";
import { Section } from "@/components/ui/Section";

/**
 * Native details/summary: keyboard and screen-reader behaviour comes for free
 * and the answers are in the markup for search engines.
 */
export function Faq({ t }: { t: Dictionary }) {
  return (
    <Section id="faq" eyebrow={t.faq.eyebrow} title={t.faq.title} tone="warm">
      <div data-reveal-group className="max-w-[76ch] divide-y divide-line border-y border-line">
        {faqIds.map((id) => {
          const item = t.faq.items[id];
          return (
            <details key={id} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[length:var(--text-h3)] transition-colors duration-[var(--dur-base)] hover:text-accent [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden
                  className="relative size-4 shrink-0 text-text-muted transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out-expo)] group-open:rotate-45"
                >
                  <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                  <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
                </span>
              </summary>
              <p className="max-w-[62ch] pb-7 text-text-secondary">{item.answer}</p>
            </details>
          );
        })}
      </div>
    </Section>
  );
}
