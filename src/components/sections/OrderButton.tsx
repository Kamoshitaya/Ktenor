"use client";

import type { ServiceId } from "@/content/services";

export const SELECT_SERVICE_EVENT = "ktenor:select-service";

/**
 * Scrolling and pre-selecting are two separate jobs: the anchor does the
 * navigation (so it still works without JS), the event tells the form which
 * service to pick.
 */
export function OrderButton({
  service,
  label,
  className,
}: {
  service: ServiceId;
  label: string;
  className?: string;
}) {
  return (
    <a
      href="#contact"
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent<ServiceId>(SELECT_SERVICE_EVENT, { detail: service }),
        );
      }}
      className={`inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-line-strong px-5 py-3 text-sm font-medium transition-[background-color,border-color,transform] duration-[var(--dur-base)] ease-[var(--ease-standard)] hover:border-accent hover:bg-[var(--glass-bg-hover)] active:scale-[0.98] ${className ?? ""}`}
    >
      {label}
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
        <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
