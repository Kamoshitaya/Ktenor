"use client";

import { useEffect, useState } from "react";
import { BeanMark } from "./BeanMark";
import { site } from "@/content/demo-cafe/site";

const links = [
  { href: "#menu", label: "Menu" },
  { href: "#room", label: "The Room" },
  { href: "#reviews", label: "Guests" },
  { href: "#contact", label: "Visit" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The hero now runs full-bleed behind the header, so the nav has to work
  // on light (dark hero) and dark (cream page, once scrolled past it) —
  // one flip, driven by the same scroll state as the background.
  const light = !scrolled && !open;

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "bg-[var(--paper)]/95 backdrop-blur-sm shadow-[0_1px_0_var(--line)]" : "bg-transparent"
      }`}
    >
      <div className="border-b border-[var(--line-soft)] bg-[var(--cream-deep)]/70">
        <div className="container-page flex h-9 items-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-ink-muted transition-colors hover:text-terracotta"
          >
            ← Back to Ktenor
          </a>
        </div>
      </div>

      <div className="container-page flex h-[76px] items-center justify-between">
        <a
          href="#top"
          className={`flex items-center gap-2.5 transition-colors duration-300 ${light ? "text-[var(--cream)]" : "text-ink"}`}
        >
          <BeanMark className="size-7 text-terracotta" />
          <span className="font-display text-[1.3rem] leading-none tracking-tight">{site.name}</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors duration-300 hover:text-terracotta ${
                light ? "text-[var(--cream)]/85" : "text-ink-soft"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <span
          className={`hidden rounded-sm border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-300 sm:inline-flex ${
            light ? "border-[var(--cream)]/40 text-[var(--cream)]" : "border-terracotta/40 text-terracotta"
          }`}
        >
          {site.addressShort}
        </span>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className={`grid size-11 place-items-center rounded-full transition-colors duration-300 md:hidden ${light ? "text-[var(--cream)]" : "text-ink"}`}
        >
          <span className="relative block h-[10px] w-[20px]">
            <span
              className="absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300"
              style={{ transform: open ? "translateY(5px) rotate(45deg)" : "none" }}
            />
            <span
              className="absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-300"
              style={{ transform: open ? "translateY(-5px) rotate(-45deg)" : "none" }}
            />
          </span>
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-[var(--line)] bg-[var(--paper)] transition-[max-height] duration-300 md:hidden ${
          open ? "max-h-64" : "max-h-0"
        }`}
      >
        <nav className="container-page flex flex-col py-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-[var(--line-soft)] py-3.5 text-base text-ink-soft last:border-b-0"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
