"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { copy } from "@/content/demo-dental/copy";
import { clinic, openingHours } from "@/content/demo-dental/site";
import { useDental } from "../DentalContext";
import { Icon, Reveal } from "../ui";

type Fields = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

export function ContactView() {
  const { t } = useDental();

  return (
    <section className="rb-section">
      <div className="rb-container">
        <Reveal className="max-w-2xl">
          <p className="rb-rule text-sm font-bold uppercase tracking-[0.16em] text-coral-ink">
            {t(copy.nav.contact)}
          </p>
          <h1 className="text-display mt-4 text-sage-900">{t(copy.contact.title)}</h1>
          <p className="text-lead mt-5 text-ink-soft">{t(copy.contact.lead)}</p>
        </Reveal>

        <div className="mt-11 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <Reveal>
              <MapPlaceholder />
            </Reveal>

            <Reveal delay={0.06}>
              <div className="rb-card p-6 sm:p-7">
                <h2 className="font-display text-base font-bold text-sage-900">
                  {t(copy.contact.hoursTitle)}
                </h2>
                <dl className="mt-4 space-y-1.5">
                  {openingHours.map((entry) => (
                    <div
                      key={entry.day.en}
                      className={`flex items-baseline justify-between gap-4 rounded-lg px-2 py-1.5 text-sm ${
                        entry.isClosed ? "text-ink-faint" : "text-ink"
                      }`}
                    >
                      <dt className="font-semibold">{t(entry.day)}</dt>
                      <dd className="tabular">{t(entry.hours)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rb-card p-6 sm:p-7">
                <h2 className="font-display text-base font-bold text-sage-900">
                  {t(copy.contact.contactTitle)}
                </h2>
                <ul className="mt-4 space-y-3.5 text-sm">
                  <ContactRow icon="pin">
                    <span className="not-italic">
                      {clinic.address.street}, {clinic.address.postal} {clinic.address.city}
                      <span className="mt-0.5 block text-ink-soft">
                        {t(clinic.address.district)} · {t(clinic.transport)}
                      </span>
                    </span>
                  </ContactRow>
                  <ContactRow icon="phone">
                    <a href={clinic.phoneHref} className="font-semibold text-sage-700 hover:underline">
                      {clinic.phone}
                    </a>
                  </ContactRow>
                  <ContactRow icon="mail">
                    <a
                      href={`mailto:${clinic.email}`}
                      className="font-semibold text-sage-700 hover:underline"
                    >
                      {clinic.email}
                    </a>
                  </ContactRow>
                  <ContactRow icon="instagram">
                    <a
                      href={clinic.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-sage-700 hover:underline"
                    >
                      {clinic.instagram}
                    </a>
                  </ContactRow>
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.08}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ icon, children }: { icon: "pin" | "phone" | "mail" | "instagram"; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-coral-ink">
        <Icon name={icon} size={19} />
      </span>
      <span className="min-w-0 leading-relaxed">{children}</span>
    </li>
  );
}

/**
 * Stands in for the embedded map a real build would carry. Drawn rather than
 * screenshotted so it cannot be mistaken for a real location, with the street
 * grid suggested by simple lines.
 */
function MapPlaceholder() {
  const { t } = useDental();

  return (
    <div className="rb-card overflow-hidden">
      <div className="relative aspect-16/10 bg-sage-100">
        <svg viewBox="0 0 400 250" className="absolute inset-0 h-full w-full" aria-hidden>
          <g stroke="#cfe3d9" strokeWidth="10" strokeLinecap="round">
            <path d="M-10 70h420M-10 170h420M90 -10v270M250 -10v270" />
          </g>
          <g stroke="#e6f0ea" strokeWidth="3">
            <path d="M-10 120h420M170 -10v270M330 -10v270" />
          </g>
          <rect x="112" y="86" width="52" height="34" rx="6" fill="#a8ccbc" opacity="0.55" />
          <rect x="272" y="182" width="62" height="30" rx="6" fill="#a8ccbc" opacity="0.55" />
          <rect x="24" y="190" width="46" height="36" rx="6" fill="#a8ccbc" opacity="0.4" />
        </svg>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
          <span className="flex flex-col items-center">
            <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-sage-900 px-3 py-1.5 text-xs font-bold text-cream shadow-lg">
              <Icon name="pin" size={14} />
              {clinic.name}
            </span>
            <span className="mt-1 h-3 w-3 rotate-45 rounded-sm bg-sage-900" />
          </span>
        </div>
      </div>

      <p className="px-5 py-3 text-xs text-ink-soft">{t(copy.contact.mapNote)}</p>
    </div>
  );
}

function ContactForm() {
  const { t } = useDental();
  const reduceMotion = useReducedMotion();
  const [fields, setFields] = useState<Fields>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const update = (field: keyof Fields, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    const next: Errors = {};
    if (!fields.name.trim()) next.name = t(copy.booking.required);
    if (!fields.email.trim()) next.email = t(copy.booking.required);
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email.trim()))
      next.email = t(copy.booking.invalidEmail);
    if (!fields.message.trim()) next.message = t(copy.booking.required);

    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  };

  return (
    <div className="rb-card p-6 sm:p-8">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            className="py-6 text-center"
          >
            <motion.span
              initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 250, damping: 17 }}
              className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sage-100 text-sage-700"
            >
              <Icon name="check" size={30} />
            </motion.span>
            <h2 className="text-h3 mt-5 text-sage-900">{t(copy.contact.sentTitle)}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              {t(copy.contact.sentLead)}
            </p>
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setFields({ name: "", email: "", message: "" });
              }}
              className="rb-btn rb-btn-ghost mt-6 !min-h-[44px] !px-5 text-sm"
            >
              {t(copy.contact.sendAnother)}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            noValidate
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="font-display text-base font-bold text-sage-900">
              {t(copy.contact.formTitle)}
            </h2>

            <div className="mt-5 space-y-4">
              <Field
                id="rb-c-name"
                label={t(copy.booking.name)}
                value={fields.name}
                error={errors.name}
                autoComplete="name"
                onChange={(value) => update("name", value)}
              />
              <Field
                id="rb-c-email"
                label={t(copy.booking.email)}
                type="email"
                value={fields.email}
                error={errors.email}
                autoComplete="email"
                onChange={(value) => update("email", value)}
              />

              <div>
                <label htmlFor="rb-c-message" className="block text-sm font-bold text-sage-900">
                  {t(copy.contact.message)}
                  <span className="text-coral-ink"> *</span>
                </label>
                <textarea
                  id="rb-c-message"
                  rows={5}
                  value={fields.message}
                  onChange={(event) => update("message", event.target.value)}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "rb-c-message-error" : undefined}
                  className={`rb-field mt-1.5 resize-y ${errors.message ? "rb-field-error" : ""}`}
                />
                {errors.message && (
                  <p
                    id="rb-c-message-error"
                    role="alert"
                    className="mt-1.5 text-xs font-semibold text-coral-ink"
                  >
                    {errors.message}
                  </p>
                )}
              </div>
            </div>

            <button type="submit" className="rb-btn rb-btn-primary mt-6 w-full">
              {t(copy.contact.send)}
            </button>
            <p className="mt-3 text-center text-xs text-ink-faint">{t(copy.common.demoNotice)}</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  error,
  type = "text",
  autoComplete,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  type?: string;
  autoComplete?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-sage-900">
        {label}
        <span className="text-coral-ink"> *</span>
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`rb-field mt-1.5 ${error ? "rb-field-error" : ""}`}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-semibold text-coral-ink">
          {error}
        </p>
      )}
    </div>
  );
}
