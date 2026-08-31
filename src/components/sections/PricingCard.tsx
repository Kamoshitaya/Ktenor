"use client";

import { useId, useState } from "react";
import type { ServicePackage } from "@/lib/cms";
import { OrderButton } from "./OrderButton";

/**
 * Hover-to-expand on desktop, tap-to-expand on touch/keyboard. Desktop hover
 * is handled in pure CSS (`.pricing-card:hover` under `@media (hover: hover)`
 * in globals.css) rather than onMouseEnter/onMouseLeave — mobile browsers
 * fire a synthetic mouseenter on the first tap to support :hover styling,
 * which fought the click toggle here (the card would open on tap-1's ghost
 * hover, then the real click on tap-2 couldn't reliably close it). CSS-only
 * hover can't do that, since `(hover: hover)` doesn't match touch input.
 * The toggle button remains the single source of truth for touch/keyboard.
 */
export function PricingCard({
  service,
  fromLabel,
  onRequestLabel,
  timelineLabel,
  whatsIncludedLabel,
  orderLabel,
}: {
  service: ServicePackage;
  fromLabel: string;
  onRequestLabel: string;
  timelineLabel: string;
  whatsIncludedLabel: string;
  orderLabel: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const panelId = `service-included-${useId()}`;
  const hasIncluded = (service.included?.length ?? 0) > 0;

  return (
    <article className="pricing-card gold-edge surface surface-hover edge-accent relative flex flex-col overflow-hidden rounded-[var(--radius-lg)]">
      <div className="p-7 sm:p-9">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h3 className="text-[length:var(--text-h3)]">{service.name}</h3>
          <p className="font-display text-[length:var(--text-h3)] tabular">
            {service.priceFrom == null ? (
              <span className="text-text-secondary">{onRequestLabel}</span>
            ) : (
              <>
                <span className="text-caption font-body font-normal text-text-muted">
                  {fromLabel}{" "}
                </span>
                <span className="text-gold">€{service.priceFrom}</span>
              </>
            )}
          </p>
        </div>

        <p className="mt-4 max-w-[46ch] text-text-secondary">{service.description}</p>

        {service.timeline ? (
          <p className="mt-6 flex items-center gap-2 text-caption text-text-muted">
            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
            {timelineLabel}: <span className="tabular">{service.timeline}</span>
          </p>
        ) : null}

        {hasIncluded ? (
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={panelId}
            onClick={() => setExpanded((v) => !v)}
            className="mt-5 flex cursor-pointer items-center gap-1.5 text-sm font-medium text-accent"
          >
            {whatsIncludedLabel}
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className="size-3.5 transition-transform duration-[var(--dur-base)] ease-[var(--ease-standard)]"
              style={{ transform: expanded ? "rotate(180deg)" : undefined }}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
            >
              <path d="M3.5 6l4.5 4.5L12.5 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : null}

        <div className="mt-8 pt-2">
          <OrderButton service={service.name} label={orderLabel} />
        </div>
      </div>

      {hasIncluded ? (
        <div id={panelId} className="pricing-expand" data-expanded={expanded}>
          <div>
            <div className="pricing-expand__content border-t border-line px-7 pb-7 pt-6 sm:px-9 sm:pb-9">
              <p className="text-caption font-medium uppercase tracking-[0.14em] text-text-muted">
                {whatsIncludedLabel}
              </p>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {service.included!.map((item) => (
                  <li key={item.id} className="flex gap-2.5 text-sm text-text-secondary">
                    <span aria-hidden className="mt-2 h-3 w-[3px] shrink-0 rounded-full bg-accent" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
