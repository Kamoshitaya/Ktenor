"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { copy } from "@/content/demo-dental/copy";
import { categories, type CategoryId } from "@/content/demo-dental/services";
import { doctors } from "@/content/demo-dental/team";
import { useDental } from "../DentalContext";
import { Icon, InitialsAvatar, Reveal } from "../ui";

type Filter = CategoryId | "all";

export function TeamView() {
  const { t, go } = useDental();
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("all");

  const visible =
    filter === "all" ? doctors : doctors.filter((doctor) => doctor.categories.includes(filter));

  return (
    <section className="rb-section">
      <div className="rb-container">
        <Reveal className="max-w-2xl">
          <p className="rb-rule text-sm font-bold uppercase tracking-[0.16em] text-coral-ink">
            {t({ sk: "Tím", en: "Team" })}
          </p>
          <h1 className="text-display mt-4 text-sage-900">{t(copy.team.title)}</h1>
          <p className="text-lead mt-5 text-ink-soft">{t(copy.team.lead)}</p>
        </Reveal>

        <Reveal delay={0.06} className="mt-9">
          <div className="flex flex-wrap gap-2" role="group" aria-label={t(copy.team.title)}>
            <button
              type="button"
              onClick={() => setFilter("all")}
              aria-pressed={filter === "all"}
              className={`rb-chip ${filter === "all" ? "rb-chip-active" : ""}`}
            >
              {t(copy.team.filterAll)}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setFilter(category.id)}
                aria-pressed={filter === category.id}
                className={`rb-chip ${filter === category.id ? "rb-chip-active" : ""}`}
              >
                {t(category.name)}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((doctor, index) => (
              <motion.article
                key={doctor.id}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.34,
                  delay: reduceMotion ? 0 : index * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="rb-card rb-card-hover flex flex-col p-6"
              >
                <div className="flex items-center gap-4">
                  <InitialsAvatar initials={doctor.initials} size={64} />
                  <div className="min-w-0">
                    <h2 className="font-display text-lg font-bold leading-tight text-sage-900">
                      {doctor.name}
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-coral-ink">{t(doctor.role)}</p>
                  </div>
                </div>

                <p className="tabular mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-sage-100 px-3 py-1 text-xs font-bold text-sage-900">
                  {doctor.yearsExperience} {t(copy.common.years)}
                </p>

                <p className="mt-4 flex-1 text-body text-sm text-ink-soft">{t(doctor.bio)}</p>

                <div className="mt-5 border-t border-line pt-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-faint">
                    {t(copy.common.speaks)}
                  </p>
                  <p className="mt-1.5 text-sm text-ink">
                    {doctor.languages.map((language) => t(language)).join(" · ")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => go("booking")}
                  className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-bold text-sage-700 transition-colors hover:text-sage-900"
                >
                  {t(copy.team.bookWith)}
                  <Icon name="arrow" size={15} />
                </button>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
