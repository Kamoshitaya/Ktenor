"use client";

import { useEffect, useState } from "react";
import { BladeMark } from "./BladeMark";
import { site } from "@/content/demo-barbershop/site";

const links = [
  { href: "#services", label: "Services" },
  { href: "#gallery", label: "Gallery" },
  { href: "#team", label: "Barbers" },
  { href: "#reviews", label: "Reviews" },
  { href: "#booking", label: "Book" },
  { href: "#contact", label: "Contact" },
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

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-[var(--line)] bg-[var(--charcoal)]/95 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="border-b border-[var(--line)] bg-[var(--charcoal-deep)]/70">
        <div className="container-page flex h-9 items-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-ivory-muted transition-colors hover:text-copper"
          >
            ← Back to Ktenor
          </a>
        </div>
      </div>

      <div className="container-page flex h-[76px] items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 text-ivory">
          <BladeMark className="size-7 text-copper" />
          <span className="font-display text-[1.3rem] leading-none tracking-tight">{site.name}</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ivory-soft transition-colors hover:text-copper"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#booking"
          className="hidden rounded-sm border border-copper/50 px-5 py-2.5 text-sm font-semibold text-copper transition-colors hover:bg-copper/10 md:inline-flex"
        >
          Book now
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid size-11 place-items-center rounded-full text-ivory md:hidden"
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
        className={`overflow-hidden border-t border-[var(--line)] bg-[var(--charcoal)] transition-[max-height] duration-300 md:hidden ${
          open ? "max-h-80" : "max-h-0"
        }`}
      >
        <nav className="container-page flex flex-col py-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-[var(--line)] py-3.5 text-base text-ivory-soft last:border-b-0"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
