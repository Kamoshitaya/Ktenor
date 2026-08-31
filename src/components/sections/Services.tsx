import type { Dictionary } from "@/i18n";
import type { ServiceAddon, ServicePackage } from "@/lib/cms";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { OrderButton } from "./OrderButton";

/**
 * No "most popular" badge: there is no sales history yet, so the label would
 * be invented. Prices are floors, and the disclaimer says so plainly.
 */
export function Services({
  t,
  services,
}: {
  t: Dictionary;
  services: { packages: ServicePackage[]; addons: ServiceAddon[] };
}) {
  return (
    <Section
      id="services"
      tone="warm"
      eyebrow={t.services.eyebrow}
      title={t.services.title}
      intro={t.services.intro}
    >
      <ul data-reveal-group className="grid gap-5 lg:grid-cols-2">
        {services.packages.map((service) => {
          return (
            <li key={service.id}>
              <article className="surface surface-hover edge-accent relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] p-7 sm:p-9">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h3 className="text-[length:var(--text-h3)]">{service.name}</h3>
                  <p className="font-display text-[length:var(--text-h3)] tabular">
                    {service.priceFrom == null ? (
                      <span className="text-text-secondary">{t.services.onRequest}</span>
                    ) : (
                      <>
                        <span className="text-caption font-body font-normal text-text-muted">
                          {t.services.from}{" "}
                        </span>
                        €{service.priceFrom}
                      </>
                    )}
                  </p>
                </div>

                <p className="mt-4 max-w-[46ch] text-text-secondary">{service.description}</p>

                {service.timeline ? (
                  <p className="mt-6 flex items-center gap-2 text-caption text-text-muted">
                    <span aria-hidden className="size-1.5 rounded-full bg-accent" />
                    {t.services.timeline}: <span className="tabular">{service.timeline}</span>
                  </p>
                ) : null}

                <div className="mt-8 pt-2">
                  <OrderButton service={service.name} label={t.actions.order} />
                </div>
              </article>
            </li>
          );
        })}

        {/* Free-form enquiry — most projects do not arrive pre-labelled. */}
        <li className="lg:col-span-2">
          <article className="relative overflow-hidden rounded-[var(--radius-lg)] border border-line-strong p-7 sm:p-9">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(90% 140% at 100% 0%, var(--c-accent-deep), transparent 60%)",
                opacity: 0.7,
              }}
            />
            <div className="flex flex-wrap items-end justify-between gap-8">
              <div>
                <h3 className="text-[length:var(--text-h3)]">{t.services.enquiry.title}</h3>
                <p className="mt-3 max-w-[52ch] text-text-secondary">
                  {t.services.enquiry.description}
                </p>
              </div>
              <Button href="#contact" block className="shrink-0">
                {t.actions.tellMeMore}
              </Button>
            </div>
          </article>
        </li>
      </ul>

      <div className="mt-[var(--spacing-block)] grid gap-10 border-t border-line pt-[var(--spacing-block)] lg:grid-cols-2">
        <div>
          <h3 className="text-[length:var(--text-h3)]">{t.services.includedTitle}</h3>
          <ul className="mt-6 space-y-3">
            {t.services.included.map((item) => (
              <li key={item} className="flex gap-3 text-text-secondary">
                <span aria-hidden className="mt-2 h-3 w-[3px] shrink-0 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-text-muted">{t.services.payment}</p>
        </div>

        <div>
          <h3 className="text-[length:var(--text-h3)]">{t.services.addonsTitle}</h3>
          <p className="mt-3 text-sm text-text-muted">{t.services.addonsIntro}</p>
          <ul className="mt-6 divide-y divide-line">
            {services.addons.map((addon) => (
              <li key={addon.id} className="flex items-baseline justify-between gap-6 py-3.5">
                <div>
                  <p className="text-text">{addon.name}</p>
                  {addon.note ? <p className="text-caption text-text-muted">{addon.note}</p> : null}
                </div>
                <p className="shrink-0 tabular text-text-secondary">
                  {addon.priceFrom == null ? "—" : `${t.services.from} €${addon.priceFrom}`}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-10 max-w-[62ch] text-caption text-text-muted">
        {t.services.disclaimer}
      </p>
    </Section>
  );
}
