"use client";

import { useEffect, useState } from "react";
import { persistTheme, type Theme } from "@/lib/theme";

type Props = {
  labels: { toDark: string; toLight: string };
  className?: string;
};

/**
 * Reads the theme the pre-paint script already applied, so there is no second
 * source of truth and no flash on hydration.
 */
export function ThemeToggle({ labels, className }: Props) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    persistTheme(next);
    setTheme(next);
  }

  const label = theme === "dark" ? labels.toLight : labels.toDark;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`grid size-11 cursor-pointer place-items-center rounded-[var(--radius-sm)] text-text-secondary transition-colors duration-[var(--dur-base)] ease-[var(--ease-standard)] hover:bg-[var(--glass-bg-hover)] hover:text-text ${className ?? ""}`}
    >
      {/* Two glyphs cross-fade instead of swapping, so the control never jumps */}
      <span className="relative block size-[18px]">
        <SunIcon
          className="absolute inset-0 transition-[opacity,transform] duration-[var(--dur-base)] ease-[var(--ease-out-expo)]"
          style={{
            opacity: theme === "dark" ? 1 : 0,
            transform: theme === "dark" ? "rotate(0deg)" : "rotate(-90deg)",
          }}
        />
        <MoonIcon
          className="absolute inset-0 transition-[opacity,transform] duration-[var(--dur-base)] ease-[var(--ease-out-expo)]"
          style={{
            opacity: theme === "dark" ? 0 : 1,
            transform: theme === "dark" ? "rotate(90deg)" : "rotate(0deg)",
          }}
        />
      </span>
    </button>
  );
}

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <circle cx="12" cy="12" r="4.5" />
      <path
        strokeLinecap="round"
        d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"
      />
    </svg>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.5 8.5 0 1 0 10.2 10.2Z"
      />
    </svg>
  );
}
