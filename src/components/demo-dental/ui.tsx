"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Scroll-in reveal. Once only — content that re-animates every time it passes
 * the viewport gets tiring on a page this long.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: reduceMotion ? 0 : 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p
          className={`rb-rule text-sm font-bold uppercase tracking-[0.16em] text-coral-ink ${
            align === "center" ? "[&::after]:mx-auto" : ""
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2 className="text-h2 mt-4 text-sage-900">{title}</h2>
      {lead && <p className="text-lead mt-4 text-ink-soft">{lead}</p>}
    </Reveal>
  );
}

export function Stars({ rating, label }: { rating: number; label?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={label ?? `${rating}/5`}>
      {[1, 2, 3, 4, 5].map((step) => (
        <svg
          key={step}
          viewBox="0 0 20 20"
          width="16"
          height="16"
          aria-hidden
          className={step <= rating ? "text-coral" : "text-sage-200"}
        >
          <path
            fill="currentColor"
            d="M10 1.8l2.5 5.1 5.6.8-4 3.9 1 5.6-5.1-2.7-5 2.7 1-5.6-4.1-3.9 5.6-.8z"
          />
        </svg>
      ))}
    </span>
  );
}

/** Round portrait stand-in — initials on a tinted disc, no invented faces. */
export function InitialsAvatar({
  initials,
  size = 56,
  tone = "sage",
}: {
  initials: string;
  size?: number;
  tone?: "sage" | "peach";
}) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-display font-bold ${
        tone === "sage" ? "bg-sage-200 text-sage-900" : "bg-peach-200 text-coral-ink"
      }`}
    >
      {initials}
    </span>
  );
}

/* --------------------------------------------------------------------------
   Icons — one consistent set, 1.7px strokes, rounded caps to match the type.
   -------------------------------------------------------------------------- */

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export type IconName = "family" | "receipt" | "clock" | "shield" | "sparkle" | "tooth" | "pin" | "phone" | "mail" | "instagram" | "check" | "arrow";

export function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const common = { ...iconProps, width: size, height: size };

  switch (name) {
    case "family":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="3" />
          <circle cx="17" cy="10" r="2.2" />
          <path d="M2.5 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5M15 20c0-2.2 1.4-3.6 3.4-3.6 1.6 0 3.1 1 3.1 3.6" />
        </svg>
      );
    case "receipt":
      return (
        <svg {...common}>
          <path d="M6 3h12v18l-2.5-1.6L13 21l-2.5-1.6L8 21l-2-1.6V3Z" />
          <path d="M9.5 8h5M9.5 12h5" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7.5V12l3 2" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3l7 3v5.5c0 4.3-2.9 8.2-7 9.5-4.1-1.3-7-5.2-7-9.5V6l7-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "sparkle":
      return (
        <svg {...common}>
          <path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9 12 3.5Z" />
          <path d="M19 16.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" />
        </svg>
      );
    case "tooth":
      return (
        <svg {...common}>
          <path d="M12 5c-2.3 0-3.4-1.2-5-1.2C5.2 3.8 4 5.4 4 8c0 2.4.9 3.8 1.5 5.7.5 1.6.7 3.3 1 5 .2 1.4.6 2.3 1.5 2.3 1.1 0 1.4-1.1 1.7-2.7.3-1.6.6-3.3 1.4-4.5.4-.7 1-1 1.9-1s1.5.3 1.9 1c.8 1.2 1.1 2.9 1.4 4.5.3 1.6.6 2.7 1.7 2.7.9 0 1.3-.9 1.5-2.3.3-1.7.5-3.4 1-5C19.1 11.8 20 10.4 20 8c0-2.6-1.2-4.2-3-4.2-1.6 0-2.7 1.2-5 1.2Z" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common}>
          <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
          <circle cx="12" cy="10" r="2.6" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <path d="M6.5 3.5h3l1.5 4-2 1.4a12 12 0 0 0 6.1 6.1l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="m4 7 8 5.5L20 7" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="3.6" />
          <circle cx="16.9" cy="7.1" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common}>
          <path d="M4.5 12h15M13 5.5l6.5 6.5-6.5 6.5" />
        </svg>
      );
  }
}
