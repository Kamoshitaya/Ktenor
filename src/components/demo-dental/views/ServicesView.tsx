"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { copy } from "@/content/demo-dental/copy";
import { categories, treatments, type CategoryId } from "@/content/demo-dental/services";
import { useDental } from "../DentalContext";
import { CostCalculator } from "../CostCalculator";
import { Icon, Reveal } from "../ui";

type Filter = CategoryId | "all";

export function ServicesView() {
  const { t, pendingTreatmentId } = useDental();
  const reduceMotion = useReducedMotion();

  /* Arriving from a tooth on the home page, the target treatment is known
     before the first paint — so it is the initial state rather than something
     an effect corrects afterwards. */
  const target = pendingTreatmentId
    ? (treatments.find((item) => item.id === pendingTreatmentId) ?? null)
    : null;

  const [filter, setFilter] = useState<Filter>(() => target?.category ?? "all");
  const [highlighted] = useState<string | null>(() => target?.id ?? null);

  /* Scrolling is a genuine side effect on an external system, so it does
     belong in an effect — and it sets no state. */
  useEffect(() => {
    if (!highlighted) return;
    const timer = window.setTimeout(() => {
      document
        .getElementById(`treatment-${highlighted}`)
        ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    }, 380);
    return () => window.clearTimeout(timer);
  }, [highlighted, reduceMotion]);

  const visible =
    filter === "all" ? treatments : treatments.filter((item) => item.category === filter);

  return (
    <>
      <section className="rb-section pb-0">
        <div className="rb-container">
          <Reveal className="max-w-2xl">
            <p className="rb-rule text-sm font-bold uppercase tracking-[0.16em] text-coral-ink">
              {t({ sk: "Cenník", en: "Price list" })}
            </p>
            <h1 className="text-display mt-4 text-sage-900">{t(copy.services.title)}</h1>
            <p className="text-lead mt-5 text-ink-soft">{t(copy.services.lead)}</p>
          </Reveal>

          {/* --- Category filter ------------------------------------------- */}
          <Reveal delay={0.06} className="mt-9">
            <div className="flex flex-wrap gap-2" role="group" aria-label={t(copy.services.title)}>
              <FilterChip
                active={filter === "all"}
                onClick={() => setFilter("all")}
                label={t(copy.services.allCategories)}
              />
              {categories.map((category) => (
                <FilterChip
                  key={category.id}
                  active={filter === category.id}
                  onClick={() => setFilter(category.id)}
                  label={t(category.name)}
                />
              ))}
            </div>
          </Reveal>

          {/* --- Treatments ------------------------------------------------- */}
          <div className="mt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={filter}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
                transition={{ duration: reduceMotion ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] }}
                className="grid gap-4 md:grid-cols-2"
              >
                {visible.map((treatment) => {
                  const category = categories.find((item) => item.id === treatment.category);
                  const isHighlighted = highlighted === treatment.id;

                  return (
                    <article
                      key={treatment.id}
                      id={`treatment-${treatment.id}`}
                      className={`rb-card rb-card-hover flex flex-col p-6 ${
                        isHighlighted ? "border-coral ring-4 ring-peach-100" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h2 className="text-h3 text-sage-900">{t(treatment.name)}</h2>
                        <span className="tabular shrink-0 rounded-full bg-sage-100 px-3 py-1 text-sm font-bold text-sage-900">
                          €{treatment.priceFrom}–{treatment.priceTo}
                        </span>
                      </div>

                      <p className="mt-3 text-body text-sm text-ink-soft">
                        {t(treatment.description)}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-2 pt-1">
                        {category && (
                          <span className="rounded-full bg-cream-deep px-2.5 py-1 text-xs font-semibold text-ink-soft">
                            {t(category.name)}
                          </span>
                        )}
                        {treatment.perTooth && (
                          <span className="rounded-full bg-peach-100 px-2.5 py-1 text-xs font-semibold text-coral-ink">
                            {t(copy.services.calcPerTooth)}
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <CostCalculator />
    </>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rb-chip ${active ? "rb-chip-active" : "hover:border-sage-300"}`}
    >
      {active && <Icon name="check" size={14} />}
      {label}
    </button>
  );
}
