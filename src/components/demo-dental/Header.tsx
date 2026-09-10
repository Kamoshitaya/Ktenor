"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { copy } from "@/content/demo-dental/copy";
import { clinic } from "@/content/demo-dental/site";
import { useDental } from "./DentalContext";
import { hrefFor, navLabels, viewIds, type ViewId } from "./routes";
import { ToothMark } from "./ToothMark";

export function Header() {
  const { t, locale, setLocale, view, go } = useDental();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* The panel covers the page, so the page behind it must not scroll. */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /* Escape closes it, the way any overlay should. */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const navigate = (next: ViewId) => {
    setMenuOpen(false);
    go(next);
  };

  return (
    <>
      <a
        href="#rb-main"
        className="sr-only rounded-full bg-sage-700 px-4 py-2 text-cream focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        {t(copy.nav.skipToContent)}
      </a>

      <header
        className={`sticky top-0 z-40 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          scrolled
            ? "bg-cream/85 shadow-[0_10px_30px_-24px_rgb(90_60_40/0.6)] backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="rb-container flex items-center justify-between gap-4 py-3.5">
          <button
            type="button"
            onClick={() => navigate("home")}
            className="group flex items-center gap-2.5"
            aria-label={`${clinic.fullName} — ${t(copy.nav.home)}`}
          >
            <span className="text-sage-700 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
              <ToothMark size={34} />
            </span>
            <span className="text-left leading-tight">
              <span className="block font-display text-[1.05rem] font-bold text-sage-900">
                {clinic.name}
              </span>
              <span className="block text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-ink-soft">
                Family Dental
              </span>
            </span>
          </button>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {viewIds.map((id) => {
              const active = view === id;
              return (
                <a
                  key={id}
                  href={hrefFor(id)}
                  onClick={(event) => {
                    event.preventDefault();
                    navigate(id);
                  }}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-full px-3.5 py-2 text-[0.92rem] font-semibold transition-colors duration-200 ${
                    active ? "text-sage-900" : "text-ink-soft hover:text-sage-900"
                  }`}
                >
                  {t(navLabels[id])}
                  {active && (
                    <motion.span
                      layoutId="rb-nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-sage-100"
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 380, damping: 32 }
                      }
                    />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <LocaleSwitch locale={locale} onChange={setLocale} />

            <button
              type="button"
              onClick={() => go("booking")}
              className="rb-btn rb-btn-primary hidden !min-h-[42px] !px-5 !py-2 text-[0.9rem] sm:inline-flex"
            >
              {t(copy.common.book)}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="rb-mobile-nav"
              aria-label={t(menuOpen ? copy.nav.closeMenu : copy.nav.openMenu)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-sage-900 transition-colors hover:bg-sage-100 lg:hidden"
            >
              <span className="relative block h-4 w-5">
                <span
                  className={`absolute left-0 block h-[2.5px] w-5 rounded-full bg-current transition-transform duration-300 ${
                    menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1/2 block h-[2.5px] w-5 -translate-y-1/2 rounded-full bg-current transition-opacity duration-200 ${
                    menuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-[2.5px] w-5 rounded-full bg-current transition-transform duration-300 ${
                    menuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="rb-mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
            className="fixed inset-0 z-50 bg-cream lg:hidden"
          >
            <div className="rb-container flex h-full flex-col">
              <div className="flex items-center justify-between py-3.5">
                <span className="flex items-center gap-2.5 text-sage-700">
                  <ToothMark size={34} animated={false} />
                  <span className="font-display text-[1.05rem] font-bold text-sage-900">
                    {clinic.name}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label={t(copy.nav.closeMenu)}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-sage-900 hover:bg-sage-100"
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
                    <path
                      d="m6 6 12 12M18 6 6 18"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1.5">
                {viewIds.map((id, index) => (
                  <motion.a
                    key={id}
                    href={hrefFor(id)}
                    onClick={(event) => {
                      event.preventDefault();
                      navigate(id);
                    }}
                    initial={reduceMotion ? false : { opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.32,
                      delay: reduceMotion ? 0 : 0.05 + index * 0.055,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`rounded-2xl px-4 py-3.5 font-display text-2xl font-bold transition-colors ${
                      view === id ? "bg-sage-100 text-sage-900" : "text-ink hover:bg-sage-100/60"
                    }`}
                  >
                    {t(navLabels[id])}
                  </motion.a>
                ))}
              </nav>

              <div className="mt-auto pb-8 pt-6">
                <button
                  type="button"
                  onClick={() => navigate("booking")}
                  className="rb-btn rb-btn-primary w-full"
                >
                  {t(copy.common.bookLong)}
                </button>
                <a
                  href={clinic.phoneHref}
                  className="mt-3 block text-center font-semibold text-sage-700"
                >
                  {clinic.phone}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function LocaleSwitch({
  locale,
  onChange,
}: {
  locale: "sk" | "en";
  onChange: (next: "sk" | "en") => void;
}) {
  return (
    <div
      className="flex items-center rounded-full border border-line bg-surface p-0.5"
      role="group"
      aria-label="Language"
    >
      {(["sk", "en"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          aria-pressed={locale === option}
          className={`rounded-full px-2.5 py-1 text-[0.75rem] font-bold uppercase tracking-wide transition-colors duration-200 ${
            locale === option
              ? "bg-sage-700 text-cream"
              : "text-ink-soft hover:text-sage-900"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
