"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { copy } from "@/content/demo-dental/copy";
import { treatments, type Treatment } from "@/content/demo-dental/services";
import { useDental } from "./DentalContext";
import { Icon, Reveal } from "./ui";

/** Preventive work is what insurers here actually contribute to. */
const INSURANCE_RATE = 0.15;

type Line = {
  treatment: Treatment;
  quantity: number;
  subtotal: number;
};

const COUNT_MS = 550;
const money = (value: number) => Math.round(value).toLocaleString("sk-SK");

/* Layout effects warn during SSR, and this one only matters once painted. */
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Counts to the new figure rather than snapping.
 *
 * Correctness first, animation second. React renders the real total, so that
 * is what stands whatever the animation does or fails to do; the count then
 * plays over the top and always lands back on `value`. The earlier version
 * inverted this — motion's animate() on a MotionValue owned the text, wrote
 * its first frame over React's, and if the tween never advanced the estimate
 * stayed one step behind, showing a price that was simply wrong.
 *
 * A tween cannot advance in a background tab, because requestAnimationFrame
 * does not fire there. Hence the timer: whatever happens to the frames, the
 * figure settles on the true one. This is a price, and a price caught
 * mid-count is a wrong price.
 *
 * It writes through a ref rather than state — sixty frames of counting
 * should not be sixty React renders.
 */
function AnimatedTotal({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  const reduceMotion = useReducedMotion();

  /* React has just painted the new total. Put back what the eye last saw so
     the count starts from there, instead of flashing the answer and
     jumping backwards to count up to it. */
  useBeforePaint(() => {
    const element = ref.current;
    if (element && !reduceMotion && shown.current !== value) {
      element.textContent = money(shown.current);
    }
  }, [value, reduceMotion]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const settle = () => {
      shown.current = value;
      element.textContent = money(value);
    };
    if (reduceMotion || shown.current === value) {
      settle();
      return;
    }

    const from = shown.current;
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / COUNT_MS);
      if (t === 1) {
        settle();
        return;
      }
      /* Quartic ease-out: the quick-then-settle shape the rest of the demo
         moves with, close enough to its cubic-bezier by eye. */
      shown.current = from + (value - from) * (1 - Math.pow(1 - t, 4));
      element.textContent = money(shown.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const guard = setTimeout(settle, COUNT_MS + 120);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(guard);
    };
  }, [value, reduceMotion]);

  return <span ref={ref}>{money(value)}</span>;
}

export function CostCalculator() {
  const { t, go } = useDental();
  const reduceMotion = useReducedMotion();
  const [picked, setPicked] = useState<string[]>([]);
  const [teeth, setTeeth] = useState(1);
  const [insured, setInsured] = useState(false);

  const toggle = (id: string) =>
    setPicked((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  const { lines, gross, discount, total } = useMemo(() => {
    const rows: Line[] = picked
      .map((id) => treatments.find((item) => item.id === id))
      .filter((item): item is Treatment => Boolean(item))
      .map((treatment) => {
        const quantity = treatment.perTooth ? teeth : 1;
        return { treatment, quantity, subtotal: treatment.priceFrom * quantity };
      });

    const grossTotal = rows.reduce((sum, row) => sum + row.subtotal, 0);
    const preventive = rows
      .filter((row) => row.treatment.category === "preventive")
      .reduce((sum, row) => sum + row.subtotal, 0);
    const insuranceCut = insured ? Math.round(preventive * INSURANCE_RATE) : 0;

    return {
      lines: rows,
      gross: grossTotal,
      discount: insuranceCut,
      total: Math.max(0, grossTotal - insuranceCut),
    };
  }, [picked, teeth, insured]);

  const hasPerTooth = lines.some((line) => line.treatment.perTooth);

  return (
    <section className="rb-section bg-cream-deep" id="calculator">
      <div className="rb-container">
        <Reveal className="max-w-2xl">
          <p className="rb-rule text-sm font-bold uppercase tracking-[0.16em] text-coral-ink">
            {t({ sk: "Kalkulačka", en: "Estimator" })}
          </p>
          <h2 className="text-h2 mt-4 text-sage-900">{t(copy.services.calculatorTitle)}</h2>
          <p className="text-lead mt-4 text-ink-soft">{t(copy.services.calculatorLead)}</p>
        </Reveal>

        <div className="mt-11 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          {/* --- Picker ---------------------------------------------------- */}
          <Reveal>
            <div className="rb-card p-6 sm:p-7">
              <fieldset>
                <legend className="font-display text-base font-bold text-sage-900">
                  {t({ sk: "Čo zvažujete?", en: "What are you considering?" })}
                </legend>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {treatments.map((treatment) => {
                    const checked = picked.includes(treatment.id);
                    return (
                      <label
                        key={treatment.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-3 transition-colors duration-200 ${
                          checked
                            ? "border-sage-500 bg-sage-100"
                            : "border-line bg-surface hover:border-sage-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggle(treatment.id)}
                          className="sr-only"
                        />
                        <span
                          aria-hidden
                          className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition-colors ${
                            checked
                              ? "border-sage-700 bg-sage-700 text-cream"
                              : "border-line-strong bg-surface text-transparent"
                          }`}
                        >
                          <Icon name="check" size={13} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold leading-snug text-ink">
                            {t(treatment.name)}
                          </span>
                          <span className="tabular mt-0.5 block text-xs text-ink-soft">
                            {t(copy.common.from)} €{treatment.priceFrom}
                            {treatment.perTooth && ` / ${t(copy.services.calcPerTooth)}`}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mt-6 grid gap-5 border-t border-line pt-6 sm:grid-cols-2">
                {/*
                  Switched off until something priced per tooth is on the list.
                  Ten of the twenty-four treatments are; the rest are charged
                  per visit, and multiplying those by a tooth count would be
                  wrong. Left live, the counter reads as broken instead —
                  the number climbs and the total sits still, which is exactly
                  how it was reported.
                */}
                <div className={hasPerTooth ? "" : "opacity-55"}>
                  <label
                    htmlFor="rb-teeth"
                    className="block font-display text-sm font-bold text-sage-900"
                  >
                    {t(copy.services.calcTeeth)}
                  </label>
                  <div className="mt-2 flex items-center gap-3">
                    <StepButton
                      onClick={() => setTeeth((n) => Math.max(1, n - 1))}
                      disabled={!hasPerTooth || teeth <= 1}
                      label={t({ sk: "Menej zubov", en: "Fewer teeth" })}
                      symbol="−"
                    />
                    <output
                      id="rb-teeth"
                      className="tabular w-10 text-center font-display text-xl font-bold text-sage-900"
                    >
                      {teeth}
                    </output>
                    <StepButton
                      onClick={() => setTeeth((n) => Math.min(12, n + 1))}
                      disabled={!hasPerTooth || teeth >= 12}
                      label={t({ sk: "Viac zubov", en: "More teeth" })}
                      symbol="+"
                    />
                  </div>
                  <p className="mt-2 text-xs text-ink-soft">
                    {t(hasPerTooth ? copy.services.calcTeethHint : copy.services.calcTeethIdle)}
                  </p>
                </div>

                <div>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={insured}
                      onChange={(event) => setInsured(event.target.checked)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden
                      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition-colors ${
                        insured
                          ? "border-sage-700 bg-sage-700 text-cream"
                          : "border-line-strong bg-surface text-transparent"
                      }`}
                    >
                      <Icon name="check" size={13} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold leading-snug text-ink">
                        {t(copy.services.calcInsurance)}
                      </span>
                      <span className="mt-1 block text-xs text-ink-soft">
                        {t(copy.services.calcInsuranceHint)}
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </Reveal>

          {/* --- Running total --------------------------------------------- */}
          <Reveal delay={0.08}>
            <div className="rb-card sticky top-24 p-6 sm:p-7">
              <h3 className="font-display text-base font-bold text-sage-900">
                {t({ sk: "Váš odhad", en: "Your estimate" })}
              </h3>

              <div className="mt-4 min-h-[6rem]">
                <AnimatePresence initial={false} mode="popLayout">
                  {lines.length === 0 ? (
                    <motion.p
                      key="empty"
                      initial={reduceMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-ink-soft"
                    >
                      {t(copy.services.calcEmpty)}
                    </motion.p>
                  ) : (
                    <motion.ul key="lines" className="space-y-2.5">
                      <AnimatePresence initial={false}>
                        {lines.map((line) => (
                          <motion.li
                            key={line.treatment.id}
                            layout={!reduceMotion}
                            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                            transition={{ duration: reduceMotion ? 0 : 0.24 }}
                            className="flex items-baseline justify-between gap-4 overflow-hidden text-sm"
                          >
                            <span className="min-w-0 text-ink">
                              {t(line.treatment.name)}
                              {line.quantity > 1 && (
                                <span className="tabular text-ink-soft"> × {line.quantity}</span>
                              )}
                            </span>
                            <span className="tabular shrink-0 font-semibold text-ink">
                              €{line.subtotal.toLocaleString("sk-SK")}
                            </span>
                          </motion.li>
                        ))}
                      </AnimatePresence>

                      {discount > 0 && (
                        <motion.li
                          layout={!reduceMotion}
                          initial={reduceMotion ? false : { opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-baseline justify-between gap-4 text-sm text-coral-ink"
                        >
                          <span>{t(copy.services.calcInsuranceLine)}</span>
                          <span className="tabular font-semibold">
                            −€{discount.toLocaleString("sk-SK")}
                          </span>
                        </motion.li>
                      )}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-5 border-t border-line pt-5">
                <div className="flex items-end justify-between gap-4">
                  <span className="font-display text-sm font-bold text-ink-soft">
                    {t(copy.services.calcTotal)}
                  </span>
                  <span className="tabular font-display text-3xl font-bold text-sage-900">
                    {t(copy.common.from)} €<AnimatedTotal value={total} />
                  </span>
                </div>

                {hasPerTooth && (
                  <p className="tabular mt-2 text-right text-xs text-ink-soft">
                    {t({ sk: "pri počte zubov", en: "for" })} {teeth}{" "}
                    {t({ sk: "", en: teeth === 1 ? "tooth" : "teeth" })}
                  </p>
                )}
              </div>

              <p className="mt-5 rounded-2xl bg-peach-100 px-4 py-3 text-xs leading-relaxed text-coral-ink">
                {t(copy.services.calcDisclaimer)}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => go("booking")}
                  className="rb-btn rb-btn-primary flex-1 !min-h-[46px] !px-5 text-sm"
                >
                  {t(copy.common.book)}
                </button>
                {picked.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setPicked([]);
                      setInsured(false);
                      setTeeth(1);
                    }}
                    className="rb-btn rb-btn-ghost !min-h-[46px] !px-5 text-sm"
                  >
                    {t(copy.services.calcReset)}
                  </button>
                )}
              </div>

              <p className="sr-only" aria-live="polite">
                {t(copy.services.calcTotal)}: {total} EUR
              </p>
              {/* gross is shown only through the itemised lines; kept for the
                  aria summary above to stay honest about pre-discount cost. */}
              <span className="sr-only">{gross}</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function StepButton({
  onClick,
  disabled,
  label,
  symbol,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  symbol: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-full border-2 border-sage-200 font-display text-lg font-bold text-sage-700 transition-colors hover:border-sage-500 hover:bg-sage-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-sage-200 disabled:hover:bg-transparent"
    >
      {symbol}
    </button>
  );
}
