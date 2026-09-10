"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { copy } from "@/content/demo-dental/copy";
import { treatments } from "@/content/demo-dental/services";
import { doctors, doctorsForCategory } from "@/content/demo-dental/team";
import { useDental } from "../DentalContext";
import { BookingCalendar, type SlotSelection } from "../BookingCalendar";
import { Icon, InitialsAvatar, Reveal } from "../ui";

type Details = { name: string; phone: string; email: string; notes: string };
type Errors = Partial<Record<keyof Details, string>>;

const STEP_COUNT = 4;
const ANY_DOCTOR = "any";

export function BookingView() {
  const { t, locale, pendingTreatmentId } = useDental();
  const reduceMotion = useReducedMotion();

  /* Coming in from a treatment link elsewhere on the site: preselect it and
     open on the dentist step rather than making the choice twice. Known before
     the first paint, so it is initial state — not an effect that corrects it. */
  const preselected =
    pendingTreatmentId && treatments.some((item) => item.id === pendingTreatmentId)
      ? pendingTreatmentId
      : null;

  const [step, setStep] = useState(() => (preselected ? 1 : 0));
  const [direction, setDirection] = useState(1);
  const [treatmentId, setTreatmentId] = useState<string | null>(() => preselected);
  const [chosenDoctorId, setChosenDoctorId] = useState<string>(ANY_DOCTOR);
  const [slot, setSlot] = useState<SlotSelection | null>(null);
  const [details, setDetails] = useState<Details>({ name: "", phone: "", email: "", notes: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const treatment = treatments.find((item) => item.id === treatmentId) ?? null;
  const availableDoctors = useMemo(
    () => doctorsForCategory(treatment?.category ?? null),
    [treatment],
  );

  /*
   * Changing treatment can strand a dentist who does not do it. Rather than
   * writing a corrected value back with an effect, the effective choice is
   * derived here — the stored one still stands if the patient switches back.
   */
  const doctorId =
    chosenDoctorId !== ANY_DOCTOR &&
    !availableDoctors.some((doctor) => doctor.id === chosenDoctorId)
      ? ANY_DOCTOR
      : chosenDoctorId;
  const setDoctorId = setChosenDoctorId;

  const goToStep = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const canContinue =
    (step === 0 && treatmentId !== null) ||
    step === 1 ||
    (step === 2 && slot !== null) ||
    step === 3;

  const validate = (): boolean => {
    const next: Errors = {};
    if (!details.name.trim()) next.name = t(copy.booking.required);
    if (!details.phone.trim()) next.phone = t(copy.booking.required);
    else if (!/^[+\d][\d\s()/-]{6,}$/.test(details.phone.trim()))
      next.phone = t(copy.booking.invalidPhone);
    if (!details.email.trim()) next.email = t(copy.booking.required);
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(details.email.trim()))
      next.email = t(copy.booking.invalidEmail);

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    setSubmitted(true);
  };

  const reset = () => {
    setSubmitted(false);
    setStep(0);
    setDirection(-1);
    setTreatmentId(null);
    setChosenDoctorId(ANY_DOCTOR);
    setSlot(null);
    setDetails({ name: "", phone: "", email: "", notes: "" });
    setErrors({});
  };

  const chosenDoctor = doctors.find((doctor) => doctor.id === doctorId) ?? null;

  if (submitted) {
    return (
      <Confirmation
        treatmentName={treatment ? t(treatment.name) : "—"}
        doctorName={chosenDoctor ? chosenDoctor.name : t(copy.booking.step2Any)}
        slot={slot}
        details={details}
        locale={locale}
        onReset={reset}
      />
    );
  }

  return (
    <section className="rb-section">
      <div className="rb-container max-w-4xl">
        <Reveal>
          <p className="rb-rule text-sm font-bold uppercase tracking-[0.16em] text-coral-ink">
            {t({ sk: "Objednanie", en: "Booking" })}
          </p>
          <h1 className="text-display mt-4 text-sage-900">{t(copy.booking.title)}</h1>
          <p className="text-lead mt-5 text-ink-soft">{t(copy.booking.lead)}</p>
        </Reveal>

        <Reveal delay={0.06} className="mt-10">
          <StepProgress step={step} onJump={goToStep} labels={copy.booking.steps.map(t)} />
        </Reveal>

        <div className="mt-9 min-h-[26rem]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial={reduceMotion ? false : { opacity: 0, x: direction * 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -30 }}
              transition={{ duration: reduceMotion ? 0.12 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 && (
                <StepTreatment selected={treatmentId} onSelect={setTreatmentId} />
              )}
              {step === 1 && (
                <StepDoctor
                  doctorsList={availableDoctors}
                  selected={doctorId}
                  onSelect={setDoctorId}
                />
              )}
              {step === 2 && (
                <div>
                  <h2 className="text-h2 text-sage-900">{t(copy.booking.step3Title)}</h2>
                  <div className="mt-6">
                    <BookingCalendar
                      doctorId={doctorId === ANY_DOCTOR ? null : doctorId}
                      value={slot}
                      onSelect={setSlot}
                    />
                  </div>
                </div>
              )}
              {step === 3 && (
                <StepDetails
                  details={details}
                  errors={errors}
                  onChange={(field, value) => {
                    setDetails((current) => ({ ...current, [field]: value }));
                    setErrors((current) => ({ ...current, [field]: undefined }));
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
          <button
            type="button"
            onClick={() => goToStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="rb-btn rb-btn-ghost !min-h-[46px] !px-5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t(copy.common.back)}
          </button>

          {step < STEP_COUNT - 1 ? (
            <button
              type="button"
              onClick={() => goToStep(step + 1)}
              disabled={!canContinue}
              className="rb-btn rb-btn-primary !min-h-[46px] !px-6 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t(copy.common.continue)}
              <Icon name="arrow" size={17} />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              className="rb-btn rb-btn-coral !min-h-[46px] !px-6 text-sm"
            >
              {t(copy.booking.submit)}
            </button>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-ink-faint">{t(copy.common.demoNotice)}</p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function StepProgress({
  step,
  labels,
  onJump,
}: {
  step: number;
  labels: string[];
  onJump: (next: number) => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <ol className="flex items-center gap-2">
      {labels.map((label, index) => {
        const done = index < step;
        const current = index === step;

        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => index < step && onJump(index)}
              disabled={index > step}
              aria-current={current ? "step" : undefined}
              className={`flex flex-1 flex-col gap-1.5 text-left ${
                index < step ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <span className="relative block h-1.5 overflow-hidden rounded-full bg-sage-200">
                <motion.span
                  className="absolute inset-y-0 left-0 rounded-full bg-sage-700"
                  initial={false}
                  animate={{ width: done || current ? "100%" : "0%" }}
                  transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
              <span
                className={`hidden text-xs font-bold sm:block ${
                  current ? "text-sage-900" : done ? "text-sage-700" : "text-ink-faint"
                }`}
              >
                {label}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function StepTreatment({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const { t } = useDental();

  return (
    <div>
      <h2 className="text-h2 text-sage-900">{t(copy.booking.step1Title)}</h2>
      <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
        {treatments.map((treatment) => {
          const active = selected === treatment.id;
          return (
            <button
              key={treatment.id}
              type="button"
              onClick={() => onSelect(treatment.id)}
              aria-pressed={active}
              className={`flex items-start justify-between gap-3 rounded-2xl border-2 p-4 text-left transition-colors duration-200 ${
                active ? "border-sage-700 bg-sage-100" : "border-line bg-surface hover:border-sage-300"
              }`}
            >
              <span className="min-w-0">
                <span className="block font-semibold text-ink">{t(treatment.name)}</span>
                <span className="tabular mt-0.5 block text-xs text-ink-soft">
                  €{treatment.priceFrom}–{treatment.priceTo}
                </span>
              </span>
              {active && (
                <span className="mt-0.5 shrink-0 text-sage-700">
                  <Icon name="check" size={18} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepDoctor({
  doctorsList,
  selected,
  onSelect,
}: {
  doctorsList: typeof doctors;
  selected: string;
  onSelect: (id: string) => void;
}) {
  const { t } = useDental();

  return (
    <div>
      <h2 className="text-h2 text-sage-900">{t(copy.booking.step2Title)}</h2>

      <div className="mt-6 space-y-2.5">
        <button
          type="button"
          onClick={() => onSelect(ANY_DOCTOR)}
          aria-pressed={selected === ANY_DOCTOR}
          className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-colors duration-200 ${
            selected === ANY_DOCTOR
              ? "border-sage-700 bg-sage-100"
              : "border-line bg-surface hover:border-sage-300"
          }`}
        >
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-peach-200 text-coral-ink">
            <Icon name="sparkle" size={24} />
          </span>
          <span>
            <span className="block font-display font-bold text-sage-900">
              {t(copy.booking.step2Any)}
            </span>
            <span className="block text-sm text-ink-soft">{t(copy.booking.step2AnyHint)}</span>
          </span>
        </button>

        {doctorsList.map((doctor) => {
          const active = selected === doctor.id;
          return (
            <button
              key={doctor.id}
              type="button"
              onClick={() => onSelect(doctor.id)}
              aria-pressed={active}
              className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-colors duration-200 ${
                active ? "border-sage-700 bg-sage-100" : "border-line bg-surface hover:border-sage-300"
              }`}
            >
              <InitialsAvatar initials={doctor.initials} size={56} />
              <span className="min-w-0">
                <span className="block font-display font-bold text-sage-900">{doctor.name}</span>
                <span className="block text-sm text-ink-soft">{t(doctor.role)}</span>
                <span className="mt-0.5 block text-xs text-ink-faint">
                  {doctor.languages.map((language) => t(language)).join(" · ")}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepDetails({
  details,
  errors,
  onChange,
}: {
  details: Details;
  errors: Errors;
  onChange: (field: keyof Details, value: string) => void;
}) {
  const { t } = useDental();

  const field = (
    name: keyof Details,
    label: string,
    type: string,
    autoComplete: string,
    required = true,
  ) => (
    <div>
      <label htmlFor={`rb-${name}`} className="block text-sm font-bold text-sage-900">
        {label}
        {required && <span className="text-coral-ink"> *</span>}
      </label>
      <input
        id={`rb-${name}`}
        type={type}
        autoComplete={autoComplete}
        value={details[name]}
        onChange={(event) => onChange(name, event.target.value)}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `rb-${name}-error` : undefined}
        className={`rb-field mt-1.5 ${errors[name] ? "rb-field-error" : ""}`}
      />
      {errors[name] && (
        <p id={`rb-${name}-error`} role="alert" className="mt-1.5 text-xs font-semibold text-coral-ink">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div>
      <h2 className="text-h2 text-sage-900">{t(copy.booking.step4Title)}</h2>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {field("name", t(copy.booking.name), "text", "name")}
        {field("phone", t(copy.booking.phone), "tel", "tel")}
        <div className="sm:col-span-2">{field("email", t(copy.booking.email), "email", "email")}</div>

        <div className="sm:col-span-2">
          <label htmlFor="rb-notes" className="block text-sm font-bold text-sage-900">
            {t(copy.booking.notes)}
          </label>
          <textarea
            id="rb-notes"
            rows={3}
            value={details.notes}
            onChange={(event) => onChange("notes", event.target.value)}
            className="rb-field mt-1.5 resize-y"
          />
          <p className="mt-1.5 text-xs text-ink-soft">{t(copy.booking.notesHint)}</p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Confirmation({
  treatmentName,
  doctorName,
  slot,
  details,
  locale,
  onReset,
}: {
  treatmentName: string;
  doctorName: string;
  slot: SlotSelection | null;
  details: Details;
  locale: "sk" | "en";
  onReset: () => void;
}) {
  const { t } = useDental();
  const reduceMotion = useReducedMotion();

  const when = slot
    ? `${new Date(slot.iso).toLocaleDateString(locale === "sk" ? "sk-SK" : "en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })}, ${slot.time}`
    : "—";

  return (
    <section className="rb-section">
      <div className="rb-container max-w-2xl text-center">
        <div className="relative mx-auto h-24 w-24">
          {/* A short, quiet burst — enough to feel like something completed,
              not so much that it reads as a game. */}
          {!reduceMotion &&
            Array.from({ length: 10 }).map((_, index) => {
              const angle = (index / 10) * Math.PI * 2;
              return (
                <motion.span
                  key={index}
                  className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
                  style={{ background: index % 2 ? "#e8785c" : "#5b937f" }}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: Math.cos(angle) * 62,
                    y: Math.sin(angle) * 62,
                    scale: [0.4, 1, 0.5],
                  }}
                  transition={{ duration: 1, delay: 0.18, ease: "easeOut" }}
                />
              );
            })}

          <motion.div
            initial={reduceMotion ? false : { scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="grid h-24 w-24 place-items-center rounded-full bg-sage-100 text-sage-700"
          >
            <motion.svg viewBox="0 0 24 24" width="44" height="44" fill="none" aria-hidden>
              <motion.path
                d="m5 12.5 4.5 4.5L19 7.5"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduceMotion ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.45, delay: 0.16, ease: "easeOut" }}
              />
            </motion.svg>
          </motion.div>
        </div>

        <h1 className="text-h2 mt-7 text-sage-900">{t(copy.booking.successTitle)}</h1>
        <p className="text-lead mx-auto mt-4 max-w-lg text-ink-soft">
          {t(copy.booking.successLead)}
        </p>

        <div className="rb-card mt-9 p-6 text-left sm:p-7">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-ink-soft">
            {t(copy.booking.summaryTitle)}
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <SummaryRow label={t(copy.booking.steps[0]!)} value={treatmentName} />
            <SummaryRow label={t(copy.booking.steps[1]!)} value={doctorName} />
            <SummaryRow label={t(copy.booking.steps[2]!)} value={when} />
            <SummaryRow label={t(copy.booking.name)} value={details.name} />
            <SummaryRow label={t(copy.booking.phone)} value={details.phone} />
            <SummaryRow label={t(copy.booking.email)} value={details.email} />
            {details.notes.trim() && (
              <SummaryRow label={t(copy.booking.notes)} value={details.notes} />
            )}
          </dl>
        </div>

        <button type="button" onClick={onReset} className="rb-btn rb-btn-ghost mt-7">
          {t(copy.booking.bookAnother)}
        </button>
      </div>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-line pb-3 last:border-0 last:pb-0">
      <dt className="font-semibold text-ink-soft">{label}</dt>
      <dd className="text-right font-semibold text-sage-900">{value}</dd>
    </div>
  );
}
