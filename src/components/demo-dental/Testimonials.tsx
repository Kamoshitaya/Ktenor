"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { averageRating, reviews } from "@/content/demo-dental/reviews";
import { copy } from "@/content/demo-dental/copy";
import { useDental } from "./DentalContext";
import { Icon, InitialsAvatar, Reveal, SectionHeading, Stars } from "./ui";

export function Testimonials() {
  const { t } = useDental();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  /* Direction feeds the slide animation so back goes back, not forward. */
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const move = useCallback((step: number) => {
    setDirection(step);
    setIndex((current) => (current + step + reviews.length) % reviews.length);
  }, []);

  /* Advances on its own, but never while someone is reading or interacting. */
  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = window.setInterval(() => move(1), 7000);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion, move]);

  const review = reviews[index]!;

  return (
    <section className="rb-section">
      <div className="rb-container">
        <SectionHeading
          eyebrow={t({ sk: "Recenzie", en: "Reviews" })}
          title={t(copy.home.reviewsTitle)}
          align="center"
        />

        <Reveal className="mt-5 flex items-center justify-center gap-3">
          <Stars rating={5} label={`${averageRating} / 5`} />
          <span className="tabular text-sm font-semibold text-ink-soft">
            {t(copy.home.reviewsLead)} {averageRating.toFixed(1)} / 5
          </span>
        </Reveal>

        <Reveal delay={0.08} className="mt-10">
          <div
            className="relative mx-auto max-w-3xl"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            {/* Fixed height keeps the surrounding page from jumping as quotes
                of different lengths swap in. */}
            <div className="relative min-h-[19rem] sm:min-h-[15rem]">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.figure
                  key={review.id}
                  custom={direction}
                  initial={reduceMotion ? false : { opacity: 0, x: direction * 42 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -42 }}
                  transition={{ duration: reduceMotion ? 0.15 : 0.38, ease: [0.22, 1, 0.36, 1] }}
                  className="rb-card absolute inset-0 flex flex-col justify-between p-7 sm:p-9"
                >
                  <div>
                    <Stars rating={review.rating} />
                    <blockquote className="text-lead mt-4 text-ink">
                      “{t(review.quote)}”
                    </blockquote>
                  </div>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <InitialsAvatar initials={review.initials} size={46} tone="peach" />
                    <span>
                      <span className="block font-display font-bold text-sage-900">
                        {review.name}
                      </span>
                      <span className="block text-sm text-ink-soft">{t(review.when)}</span>
                    </span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <CarouselButton
                onClick={() => move(-1)}
                label={t({ sk: "Predchádzajúca recenzia", en: "Previous review" })}
                flip
              />

              <div className="flex items-center gap-1.5">
                {reviews.map((item, dot) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setDirection(dot > index ? 1 : -1);
                      setIndex(dot);
                    }}
                    aria-label={`${dot + 1} / ${reviews.length}`}
                    aria-current={dot === index}
                    className="grid h-8 w-5 place-items-center"
                  >
                    <span
                      className={`block rounded-full transition-all duration-300 ${
                        dot === index ? "h-2 w-6 bg-sage-700" : "h-2 w-2 bg-sage-300"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <CarouselButton
                onClick={() => move(1)}
                label={t({ sk: "Ďalšia recenzia", en: "Next review" })}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CarouselButton({
  onClick,
  label,
  flip = false,
}: {
  onClick: () => void;
  label: string;
  flip?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-full border-2 border-sage-200 text-sage-700 transition-colors hover:border-sage-500 hover:bg-sage-100"
    >
      <span className={flip ? "rotate-180" : undefined}>
        <Icon name="arrow" size={18} />
      </span>
    </button>
  );
}
