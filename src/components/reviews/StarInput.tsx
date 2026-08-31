"use client";

import { useState } from "react";

const STAR_PATH =
  "M10 1.6l2.47 5.15 5.53.8-4 4.03.94 5.72L10 14.6l-4.94 2.7.94-5.72-4-4.03 5.53-.8L10 1.6z";

/**
 * A real radiogroup, not five clickable divs — arrow keys move the selection
 * and each star announces "Rate n out of 5" plus its checked state. Hovering
 * previews a value without committing it; the committed value is what
 * actually renders once the pointer leaves.
 */
export function StarInput({
  value,
  onChange,
  labelFor,
  invalid,
}: {
  value: number;
  onChange: (rating: number) => void;
  labelFor: (rating: number) => string;
  invalid?: boolean;
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  function move(delta: number, from: number) {
    const next = Math.min(5, Math.max(1, from + delta));
    onChange(next);
    document.getElementById(`star-${next}`)?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-invalid={invalid ? true : undefined}
      className="flex items-center gap-1.5"
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          id={`star-${n}`}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={labelFor(n)}
          tabIndex={value === n || (value === 0 && n === 1) ? 0 : -1}
          onMouseEnter={() => setHover(n)}
          onFocus={() => setHover(n)}
          onBlur={() => setHover(0)}
          onClick={() => onChange(n)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowUp") {
              e.preventDefault();
              move(1, value || n);
            } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
              e.preventDefault();
              move(-1, value || n);
            }
          }}
          className="grid size-11 cursor-pointer place-items-center rounded-[var(--radius-xs)] outline-none transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out-expo)] hover:scale-110 focus-visible:ring-2 focus-visible:ring-accent"
        >
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            width={30}
            height={30}
            className={
              n <= shown
                ? "text-accent transition-colors duration-[var(--dur-fast)]"
                : "text-line-strong transition-colors duration-[var(--dur-fast)]"
            }
          >
            <path d={STAR_PATH} fill="currentColor" />
          </svg>
        </button>
      ))}
    </div>
  );
}
