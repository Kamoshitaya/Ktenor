"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { site } from "@/lib/site";
import { services, type ServiceId } from "@/content/services";
import { dialCodes } from "@/content/dial-codes";
import { budgetKeys, validateEnquiry, type EnquiryErrorKey } from "@/lib/enquiry";
import { Button } from "@/components/ui/Button";
import { SELECT_SERVICE_EVENT } from "./OrderButton";

type Errors = Partial<Record<EnquiryErrorKey, string>>;
type Status = "idle" | "sending" | "sent" | "failed" | "throttled";

/**
 * Validation rules come from the shared module, so the instant feedback here
 * and the authoritative check on the server cannot drift apart.
 */
export function Contact({ t, locale }: { t: Dictionary; locale: Locale }) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  /** Used to spot a form completed faster than a human could read it. */
  const startedAt = useRef(Date.now());

  // A service card was clicked — preselect it and let the anchor do the scroll.
  useEffect(() => {
    function onSelect(event: Event) {
      const id = (event as CustomEvent<ServiceId>).detail;
      const select = serviceRef.current;
      if (!select) return;
      select.value = id;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
    window.addEventListener(SELECT_SERVICE_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_SERVICE_EVENT, onSelect);
  }, []);

  function read(form: HTMLFormElement) {
    const data = new FormData(form);
    const get = (key: string) => String(data.get(key) ?? "").trim();

    // "Other" leaves the code out — the visitor is expected to type their
    // own country code into the number field, since there is no dial code to
    // prepend for it. Otherwise the two visible controls become one E.164-ish
    // string: digits are stripped from the local part so grouping the person
    // typed ("911 608 486") doesn't survive into the stored number.
    const code = get("phoneDialCode");
    const localNumber = get("phoneNumber");
    const phone = code ? `${code}${localNumber.replace(/[^\d]/g, "")}` : localNumber;

    return {
      name: get("name"),
      email: get("email"),
      phone,
      service: get("service"),
      budget: get("budget"),
      timeline: get("timeline"),
      message: get("message"),
      consent: data.get("consent") === "on",
      company: get("company"),
      locale,
      startedAt: startedAt.current,
    };
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const values = read(form);
    const keys = validateEnquiry(values);

    const next: Errors = {};
    for (const key of keys) next[key] = t.contact.errors[key];
    setErrors(next);

    if (keys.length > 0) {
      // "phone" is validated as one field but rendered as two inputs — send
      // focus to the one the visitor actually types the number into.
      const first = keys[0] === "phone" ? "phoneNumber" : keys[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.status === 429) {
        setStatus("throttled");
        return;
      }
      if (!response.ok) {
        setStatus("failed");
        return;
      }

      form.reset();
      startedAt.current = Date.now();
      setStatus("sent");
    } catch {
      // Offline, blocked, or the request never left — all the same to the
      // visitor, and all recoverable by contacting directly.
      setStatus("failed");
    }
  }

  return (
    <section
      id="contact"
      className="relative isolate scroll-mt-[72px] py-[var(--spacing-section)]"
    >
      <div aria-hidden className="section-wash" data-tone="cool" />
      <div className="container-page grid gap-[var(--spacing-block)] lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="flex items-center gap-3 text-caption uppercase tracking-[0.24em] text-text-muted">
            <span aria-hidden className="flex gap-[3px]">
              <span className="h-3 w-[3px] rounded-full bg-accent" />
              <span className="h-3 w-[3px] rounded-full bg-accent-mid" />
              <span className="h-3 w-[3px] rounded-full bg-accent-deep" />
            </span>
            {t.contact.eyebrow}
          </p>
          <h2 className="mt-5 text-[length:var(--text-h1)]">{t.contact.title}</h2>
          <p className="mt-6 max-w-[46ch] text-[length:var(--text-lead)] text-text-secondary">
            {t.contact.intro}
          </p>

          <div className="surface mt-10 rounded-[var(--radius-md)] p-6">
            <p className="text-sm font-medium">{t.contact.direct}</p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <a
                href={`mailto:${site.contact.email}`}
                className="text-accent underline-offset-4 transition-colors duration-[var(--dur-base)] hover:underline"
              >
                {site.contact.email}
              </a>
              <a
                href={site.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline-offset-4 transition-colors duration-[var(--dur-base)] hover:underline"
              >
                WhatsApp
              </a>
              <a
                href={`tel:${site.contact.phone}`}
                className="text-accent underline-offset-4 transition-colors duration-[var(--dur-base)] hover:underline"
              >
                {site.contact.phoneDisplay}
              </a>
            </div>
          </div>
        </div>

        <form ref={formRef} noValidate onSubmit={onSubmit} className="grid gap-6">
          {/* Bot trap. Off-screen rather than display:none, which some bots
              know to skip, and hidden from assistive tech either way. */}
          <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
            <label htmlFor={`${uid}-company`}>Company</label>
            <input id={`${uid}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <Field
            id={`${uid}-name`}
            name="name"
            label={t.contact.fields.name}
            required
            requiredLabel={t.contact.fields.required}
            error={errors.name}
            autoComplete="name"
          />

          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              id={`${uid}-email`}
              name="email"
              type="email"
              label={t.contact.fields.email}
              required
              requiredLabel={t.contact.fields.required}
              error={errors.email}
              autoComplete="email"
              inputMode="email"
            />

            <PhoneField
              id={`${uid}-phone`}
              label={t.contact.fields.phone}
              requiredLabel={t.contact.fields.required}
              error={errors.phone}
              t={t}
            />
          </div>

          <div>
            <Label htmlFor={`${uid}-service`} required requiredLabel={t.contact.fields.required}>
              {t.contact.fields.service}
            </Label>
            <select
              ref={serviceRef}
              id={`${uid}-service`}
              name="service"
              defaultValue=""
              aria-invalid={errors.service ? true : undefined}
              aria-describedby={errors.service ? `${uid}-service-error` : undefined}
              className={inputClass(!!errors.service)}
            >
              <option value="" disabled>
                {t.contact.fields.servicePlaceholder}
              </option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {t.services.items[service.id].name}
                </option>
              ))}
            </select>
            <FieldError id={`${uid}-service-error`} message={errors.service} />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor={`${uid}-budget`} optionalLabel={t.contact.fields.optional}>
                {t.contact.fields.budget}
              </Label>
              <select
                id={`${uid}-budget`}
                name="budget"
                defaultValue=""
                className={inputClass(false)}
              >
                <option value="">{t.contact.fields.budgetPlaceholder}</option>
                {budgetKeys.map((key) => (
                  <option key={key} value={key}>
                    {t.contact.budgets[key]}
                  </option>
                ))}
              </select>
            </div>
            <Field
              id={`${uid}-timeline`}
              name="timeline"
              label={t.contact.fields.timeline}
              optionalLabel={t.contact.fields.optional}
            />
          </div>

          <div>
            <Label htmlFor={`${uid}-message`} optionalLabel={t.contact.fields.optional}>
              {t.contact.fields.message}
            </Label>
            <textarea
              id={`${uid}-message`}
              name="message"
              rows={5}
              placeholder={t.contact.fields.messagePlaceholder}
              className={`${inputClass(false)} resize-y`}
            />
          </div>

          <div>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-text-secondary">
              <input
                type="checkbox"
                name="consent"
                aria-invalid={errors.consent ? true : undefined}
                className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[var(--c-accent)]"
              />
              <span>
                {t.contact.consent.label}{" "}
                <a
                  href={`/${locale}/privacy`}
                  className="text-accent underline underline-offset-4"
                >
                  {t.contact.consent.link}
                </a>
              </span>
            </label>
            <FieldError id={`${uid}-consent-error`} message={errors.consent} />
          </div>

          <div className="grid gap-5">
            <Button type="submit" block disabled={status === "sending"}>
              {status === "sending" ? t.contact.sending : t.contact.submit}
            </Button>

            {/* One live region for every outcome, so a screen reader announces
                the result without the focus being moved out from under anyone. */}
            <div aria-live="polite" aria-atomic="true">
              {status === "sent" ? (
                <div className="surface rounded-[var(--radius-md)] p-5">
                  <p className="flex items-center gap-2.5 text-sm font-medium">
                    <span aria-hidden className="flex gap-1">
                      <span className="h-4 w-1 rounded-full bg-accent" />
                      <span className="h-4 w-1 rounded-full bg-accent-mid" />
                      <span className="h-4 w-1 rounded-full bg-accent" />
                    </span>
                    {t.contact.success.title}
                  </p>
                  <p className="mt-2 text-sm text-text-secondary">
                    {t.contact.success.body}
                  </p>
                </div>
              ) : null}

              {status === "failed" ? (
                <div className="rounded-[var(--radius-md)] border border-[var(--c-danger-border)] bg-[var(--c-danger-bg)] p-5">
                  <p className="text-sm font-medium text-[var(--c-danger)]">
                    {t.contact.failure.title}
                  </p>
                  <p className="mt-2 text-sm text-text-secondary">
                    {t.contact.failure.body}
                  </p>
                </div>
              ) : null}

              {status === "throttled" ? (
                <div className="rounded-[var(--radius-md)] border border-[var(--c-danger-border)] bg-[var(--c-danger-bg)] p-5">
                  <p className="text-sm text-text-secondary">{t.contact.rateLimit}</p>
                </div>
              ) : null}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

/** "9116084869" -> "911 608 486". Depends only on digit count, not the
 *  digits themselves, so the typed prefix and the static mask below stay
 *  character-aligned as the visitor types. */
function groupDigits(digits: string): string {
  const groups: string[] = [];
  for (let i = 0; i < digits.length; i += 3) groups.push(digits.slice(i, i + 3));
  return groups.join(" ");
}

const PHONE_MASK = groupDigits("000000000"); // "000 000 000"

/**
 * One bordered box holding a compact dial-code select and the number input,
 * merged with a hairline divider rather than two separate fields — that was
 * the "awkward blocks" complaint. The number input sits on real, opaque text
 * (fixing "not clearly visible") over a static "000 000 000" layer in the
 * same position: typed digits paint over the mask as they're entered, so it
 * reads as digits replacing zeros rather than a placeholder that vanishes
 * outright. Both layers run through the same grouping function, so they stay
 * aligned without measuring anything.
 *
 * "Other" has no fixed-length number to mask against, so it falls back to a
 * plain input with a native placeholder instead of pretending to.
 */
function PhoneField({
  id,
  label,
  requiredLabel,
  error,
  t,
}: {
  id: string;
  label: string;
  requiredLabel: string;
  error?: string;
  t: Dictionary;
}) {
  const [dialCode, setDialCode] = useState("+421");
  const [digits, setDigits] = useState("");
  const [otherValue, setOtherValue] = useState("");
  const numberRef = useRef<HTMLInputElement>(null);
  const errorId = `${id}-error`;
  const isOther = dialCode === "";
  const formatted = isOther ? otherValue : groupDigits(digits);

  return (
    <div>
      <Label htmlFor={id} required requiredLabel={requiredLabel}>
        {label}
      </Label>
      <div
        className={`mt-2 flex items-stretch overflow-hidden rounded-[var(--radius-sm)] border bg-bg-raised transition-colors duration-[var(--dur-base)] focus-within:border-accent ${
          error ? "border-[var(--c-danger-border)]" : "border-line-strong"
        }`}
      >
        <select
          name="phoneDialCode"
          aria-label={t.contact.fields.dialCodeLabel}
          value={dialCode}
          onChange={(e) => setDialCode(e.target.value)}
          // A transparent background here (matching the wrapper's own
          // bg-bg-raised only visually) leaves the browser unable to tell
          // what's behind the control, and Chromium falls back to a plain
          // white native popup for the option list regardless of the site's
          // dark theme. An opaque background of the exact same colour looks
          // identical but gives the popup something real to theme itself
          // against.
          style={{ colorScheme: "inherit" }}
          className="w-auto shrink-0 cursor-pointer border-0 bg-bg-raised py-3.5 pl-3.5 pr-1 text-body text-text outline-none"
        >
          {dialCodes.map((d) => (
            <option key={d.id} value={d.code}>
              {d.code || t.contact.countries.OTHER}
            </option>
          ))}
        </select>
        <span aria-hidden className="my-2.5 w-px shrink-0 bg-line-strong" />
        <div
          className="relative min-w-0 flex-1 cursor-text"
          onClick={() => numberRef.current?.focus()}
        >
          {!isOther ? (
            <span
              aria-hidden
              className="tabular pointer-events-none absolute inset-0 select-none whitespace-pre py-3.5 pl-2 text-body text-text-muted/35"
            >
              {PHONE_MASK}
            </span>
          ) : null}
          <input
            ref={numberRef}
            id={id}
            name="phoneNumber"
            type="tel"
            inputMode={isOther ? "text" : "tel"}
            autoComplete="tel"
            value={formatted}
            onChange={(e) => {
              if (isOther) {
                setOtherValue(e.target.value);
              } else {
                setDigits(e.target.value.replace(/\D/g, "").slice(0, 14));
              }
            }}
            placeholder={isOther ? t.contact.fields.phoneNumberPlaceholderOther : undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className="tabular relative w-full min-w-0 border-0 bg-transparent py-3.5 pl-2 pr-3 text-body text-text outline-none placeholder:text-text-muted"
          />
        </div>
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function inputClass(invalid: boolean) {
  return `mt-2 w-full rounded-[var(--radius-sm)] border bg-bg-raised px-4 py-3.5 text-body text-text outline-none transition-[border-color] duration-[var(--dur-base)] placeholder:text-text-muted focus-visible:border-accent ${
    invalid ? "border-[var(--c-danger-border)]" : "border-line-strong"
  }`;
}

function Label({
  htmlFor,
  children,
  required,
  requiredLabel,
  optionalLabel,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  requiredLabel?: string;
  optionalLabel?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="flex items-baseline gap-2 text-sm text-text-secondary">
      {children}
      {required ? (
        <span className="text-caption text-text-muted">({requiredLabel})</span>
      ) : optionalLabel ? (
        <span className="text-caption text-text-muted">({optionalLabel})</span>
      ) : null}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-caption text-danger">
      {message}
    </p>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  error,
  required,
  requiredLabel,
  optionalLabel,
  ...rest
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  error?: string;
  required?: boolean;
  requiredLabel?: string;
  optionalLabel?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label
        htmlFor={id}
        required={required}
        requiredLabel={requiredLabel}
        optionalLabel={optionalLabel}
      >
        {label}
      </Label>
      <input
        id={id}
        name={name}
        type={type}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputClass(!!error)}
        {...rest}
      />
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}
