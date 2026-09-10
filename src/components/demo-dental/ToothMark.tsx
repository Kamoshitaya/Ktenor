"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * The brand mark: a tooth whose roots turn into a sprout. It carries the name
 * — root, and bloom — without a literal drawing of either, and stays a shape
 * rather than a cartoon character, which is where a family clinic tips over
 * into a children's brand.
 */
export function ToothMark({
  size = 34,
  className = "",
  animated = true,
}: {
  size?: number;
  className?: string;
  animated?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = animated && !reduceMotion;

  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* Tooth body: a soft crown that tapers into two roots. */}
      <path
        d="M24 6.5c-5.4 0-8.2-2-11.6-2C8.2 4.5 5 8.1 5 14.2c0 5.4 1.9 8.4 3.2 12.6 1 3.2 1.5 6.6 2 10.1.4 3 1.3 5.1 3.3 5.1 2.4 0 3.1-2.4 3.7-6 .5-3.1 1.1-6.6 2.6-9.3.9-1.6 2-2.4 4.2-2.4"
        fill="currentColor"
      />
      <path
        d="M24 6.5c5.4 0 8.2-2 11.6-2 4.2 0 7.4 3.6 7.4 9.7 0 5.4-1.9 8.4-3.2 12.6-1 3.2-1.5 6.6-2 10.1-.4 3-1.3 5.1-3.3 5.1-2.4 0-3.1-2.4-3.7-6-.5-3.1-1.1-6.6-2.6-9.3-.9-1.6-2-2.4-4.2-2.4"
        fill="currentColor"
        opacity="0.82"
      />

      {/* The sprout, in the accent colour — the "bloom" half of the name. */}
      <motion.g
        style={{ transformOrigin: "24px 20px" }}
        animate={shouldAnimate ? { rotate: [-4, 4, -4] } : undefined}
        transition={
          shouldAnimate
            ? { duration: 5.5, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }
            : undefined
        }
      >
        <path
          d="M24 21.5v-7"
          stroke="var(--color-coral)"
          strokeWidth="2.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M24 15.4c0-2.6 2.1-4.6 4.7-4.6 0 2.6-2.1 4.6-4.7 4.6Z"
          fill="var(--color-coral)"
        />
        <path
          d="M24 17.6c0-2.2-1.8-3.9-4-3.9 0 2.2 1.8 3.9 4 3.9Z"
          fill="var(--color-coral)"
          opacity="0.75"
        />
      </motion.g>
    </svg>
  );
}
