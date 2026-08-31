import type { Dictionary } from "@/i18n";
import { Button } from "@/components/ui/Button";

/** Last chance to act before the footer, and the only place the "fewer
 *  projects, full attention" promise is made. */
export function CtaBand({ t }: { t: Dictionary }) {
  return (
    <section className="pb-[var(--spacing-section)]">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-line-strong px-7 py-[var(--spacing-block)] text-center sm:px-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(70% 120% at 50% 110%, var(--c-accent-deep), transparent 65%)",
              opacity: 0.8,
            }}
          />
          <h2 className="mx-auto max-w-[18ch] text-[length:var(--text-h1)]">
            {t.cta.title}
          </h2>
          <p className="mx-auto mt-6 max-w-[52ch] text-[length:var(--text-lead)] text-text-secondary">
            {t.cta.description}
          </p>
          <div className="mt-10 flex justify-center">
            <Button href="#contact" block>
              {t.actions.startProject}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
