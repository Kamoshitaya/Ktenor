"use client";

export const SELECT_SERVICE_EVENT = "ktenor:select-service";

/**
 * Scrolling and pre-selecting are two separate jobs: the anchor does the
 * navigation (so it still works without JS), the event tells the form which
 * service to pick. `service` is the service's display name — it doubles as
 * the contact form's <option value>, since services now come from the CMS
 * and have no fixed slug to key off of.
 */
export function OrderButton({
  service,
  label,
  className,
}: {
  service: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href="#contact"
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent<string>(SELECT_SERVICE_EVENT, { detail: service }),
        );
      }}
      className={`order-btn inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-gold-contrast transition-[filter,transform] duration-[var(--dur-base)] ease-[var(--ease-standard)] hover:brightness-[1.08] active:scale-[0.98] ${className ?? ""}`}
    >
      {label}
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
        <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
