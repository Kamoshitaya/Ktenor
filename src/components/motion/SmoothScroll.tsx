"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registerLenis } from "@/lib/scroll";

/**
 * The one animation dependency that earns its place: inertial scrolling is
 * genuinely hard to hand-roll well, and it is what makes a long page feel
 * expensive rather than merely long.
 *
 * Disabled outright under reduced motion — hijacking the scroll is exactly
 * what that preference exists to prevent.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      // Same expo-out curve as every other transition on the site.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    });
    registerLenis(lenis);
    if (process.env.NODE_ENV === "development") {
      (window as unknown as { lenis?: Lenis }).lenis = lenis;
    }

    // The background drifts against the scroll. Written straight onto the
    // element rather than into a custom property on :root — a variable there
    // invalidates the style of every node that reads it, once per frame.
    const field = document.querySelector<HTMLElement>("[data-field]");
    let lastShift = -1;
    const driftBackground = (scroll: number) => {
      if (!field) return;
      // Deliberately tiny. Depth should be felt, not watched.
      const shift = Math.round(Math.min(scroll * 0.035, 90));
      if (shift === lastShift) return;
      lastShift = shift;
      field.style.transform = `translate3d(0, ${-shift}px, 0)`;
    };

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      driftBackground(lenis.scroll);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // In-page anchors have to go through Lenis or they fight it. Nav links
    // point at `/${locale}#section` so they still work from other routes
    // (e.g. /reviews) via a normal browser navigation back to the homepage —
    // only intercept when the link's path is the page we're already on.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href*="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      const hashIndex = href.indexOf("#");
      const hash = href.slice(hashIndex);
      if (hash === "#") return;
      const path = href.slice(0, hashIndex);
      if (path && path !== window.location.pathname) return;
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -72 });
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      registerLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
