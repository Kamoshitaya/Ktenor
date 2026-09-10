"use client";

import { motion, useReducedMotion } from "motion/react";
import { copy } from "@/content/demo-dental/copy";
import { categories } from "@/content/demo-dental/services";
import { useDental } from "../DentalContext";
import { ToothTeaser } from "../ToothTeaser";
import { Testimonials } from "../Testimonials";
import { Icon, Reveal, SectionHeading, type IconName } from "../ui";

const WHY_ICONS: IconName[] = ["family", "receipt", "clock", "shield"];

const CATEGORY_ICONS: Record<string, IconName> = {
  preventive: "shield",
  kids: "family",
  cosmetic: "sparkle",
  restorative: "tooth",
  emergency: "clock",
};

export function HomeView() {
  return (
    <>
      <Hero />
      <WhyUs />
      <ToothTeaser />
      <ServicesPreview />
      <Testimonials />
      <CtaBand />
    </>
  );
}

function Hero() {
  const { t, go } = useDental();
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      {/* Soft colour fields behind the copy. Blurred gradients rather than
          images, so they cost nothing to load and scale to any viewport. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <span
          className="rb-blob rb-drift -left-24 -top-32 h-[26rem] w-[26rem]"
          style={{ background: "radial-gradient(circle, #cfe3d9 0%, transparent 68%)" }}
        />
        <span
          className="rb-blob rb-drift-slow -right-20 top-10 h-[30rem] w-[30rem]"
          style={{ background: "radial-gradient(circle, #fbd9cb 0%, transparent 68%)" }}
        />
        <span
          className="rb-blob rb-drift bottom-[-14rem] left-1/3 h-[24rem] w-[24rem]"
          style={{ background: "radial-gradient(circle, #e6f0ea 0%, transparent 70%)" }}
        />
      </div>

      <div className="rb-container grid items-center gap-12 pb-16 pt-12 lg:grid-cols-[1.08fr_0.92fr] lg:pb-24 lg:pt-20">
        <div>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-surface/70 px-4 py-1.5 text-sm font-semibold text-sage-700"
          >
            <span className="h-2 w-2 rounded-full bg-coral" />
            {t(copy.home.heroEyebrow)}
          </motion.p>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="text-display mt-6 text-sage-900"
          >
            {t(copy.home.heroTitle)}
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            className="text-lead mt-5 max-w-xl text-ink-soft"
          >
            {t(copy.home.heroLead)}
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <button
              type="button"
              onClick={() => go("booking")}
              className="rb-btn rb-btn-primary"
            >
              {t(copy.common.bookLong)}
              <Icon name="arrow" size={18} />
            </button>
            <button
              type="button"
              onClick={() => go("services")}
              className="rb-btn rb-btn-ghost"
            >
              {t(copy.home.heroSecondary)}
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md"
        >
          <HeroCard />
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Stands in for the practice photograph a real build would carry. Built from
 * shapes rather than a stock image of a stranger's mouth, which is both more
 * on-brand and more honest about being a demo.
 */
function HeroCard() {
  const { t } = useDental();

  return (
    <div className="rb-card overflow-hidden p-7">
      <div
        className="grid aspect-square place-items-center rounded-[var(--radius-card)]"
        style={{ background: "linear-gradient(150deg, #e6f0ea 0%, #fde9e0 100%)" }}
      >
        <span className="text-sage-700">
          <Icon name="tooth" size={120} />
        </span>
      </div>

      <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
        {[
          { value: "9", label: t({ sk: "rokov v Starom Meste", en: "years in the Old Town" }) },
          { value: "5", label: t({ sk: "špecialistov", en: "specialists" }) },
          { value: "3", label: t({ sk: "jazyky", en: "languages" }) },
        ].map((stat) => (
          <div key={stat.label}>
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <span className="tabular block font-display text-2xl font-bold text-sage-900">
                {stat.value}
              </span>
              <span className="mt-1 block text-xs leading-snug text-ink-soft">{stat.label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function WhyUs() {
  const { t } = useDental();

  return (
    <section className="rb-section">
      <div className="rb-container">
        <SectionHeading
          eyebrow={t({ sk: "Prečo my", en: "Why us" })}
          title={t(copy.home.whyTitle)}
          lead={t(copy.home.whyLead)}
          align="center"
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {copy.home.why.map((item, index) => (
            <Reveal key={item.title.en} delay={index * 0.07}>
              <article className="rb-card rb-card-hover h-full p-6">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-peach-100 text-coral-ink">
                  <Icon name={WHY_ICONS[index]!} size={24} />
                </span>
                <h3 className="text-h3 mt-5 text-sage-900">{t(item.title)}</h3>
                <p className="mt-2.5 text-body text-sm text-ink-soft">{t(item.text)}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesPreview() {
  const { t, go } = useDental();

  return (
    <section className="rb-section bg-cream-deep">
      <div className="rb-container">
        <SectionHeading
          eyebrow={t({ sk: "Služby", en: "Services" })}
          title={t(copy.home.servicesTitle)}
          lead={t(copy.home.servicesLead)}
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Reveal key={category.id} delay={index * 0.06}>
              <button
                type="button"
                onClick={() => go("services")}
                className="rb-card rb-card-hover group h-full w-full p-6 text-left"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sage-100 text-sage-700 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                  <Icon name={CATEGORY_ICONS[category.id] ?? "tooth"} size={24} />
                </span>
                <h3 className="text-h3 mt-5 text-sage-900">{t(category.name)}</h3>
                <p className="mt-2.5 text-body text-sm text-ink-soft">{t(category.blurb)}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-coral-ink">
                  {t(copy.home.servicesCta)}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <Icon name="arrow" size={15} />
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBand() {
  const { t, go } = useDental();

  return (
    <section className="rb-section">
      <div className="rb-container">
        <Reveal>
          <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-sage-900 px-7 py-14 text-center sm:px-14">
            <span
              aria-hidden
              className="rb-blob rb-drift-slow -right-16 -top-16 h-72 w-72 opacity-30"
              style={{ background: "radial-gradient(circle, #e8785c 0%, transparent 70%)" }}
            />
            <h2 className="text-h2 relative text-cream">{t(copy.home.ctaTitle)}</h2>
            <p className="text-lead relative mx-auto mt-4 max-w-xl text-sage-200">
              {t(copy.home.ctaLead)}
            </p>
            <button
              type="button"
              onClick={() => go("booking")}
              className="rb-btn rb-btn-coral relative mt-8"
            >
              {t(copy.common.bookLong)}
              <Icon name="arrow" size={18} />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
