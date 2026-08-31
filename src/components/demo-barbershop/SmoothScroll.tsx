"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    });

    const field = document.querySelector<HTMLElement>("[data-field]");
    let lastShift = -1;
    const driftBackground = (scroll: number) => {
      if (!field) return;
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

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -70 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
