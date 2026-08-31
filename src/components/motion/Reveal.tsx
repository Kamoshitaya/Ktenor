"use client";

import { useEffect } from "react";

/**
 * Scroll reveals driven by an IntersectionObserver, which the browser can
 * evaluate off the main thread.
 *
 * The hidden state lives in CSS, so a reveal that never fires would leave
 * content permanently invisible — worse than no animation at all. There is
 * therefore a safety net, but it is deliberately cheap: it runs at most a few
 * times a second, and it unbinds the moment the observer proves it works.
 * The earlier version measured every pending element on every scroll event,
 * which forced a synchronous layout dozens of times a second.
 */
export function Reveal() {
  useEffect(() => {
    const selector = "[data-reveal], [data-reveal-group] > *";

    // Group items are already hidden by CSS; JS only gives them their stagger.
    document.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) => {
      Array.from(group.children).forEach((child, index) => {
        (child as HTMLElement).style.setProperty("--reveal-delay", `${index * 60}ms`);
      });
    });

    const targets = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const reveal = (el: Element) => el.setAttribute("data-revealed", "");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      targets.forEach(reveal);
      return;
    }

    const pending = new Set<HTMLElement>(targets);
    let observerWorks = false;
    let netTimer = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        observerWorks = true;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          // One-shot: re-animating on the way back up reads as a glitch.
          observer.unobserve(entry.target);
          pending.delete(entry.target as HTMLElement);
        }
        if (pending.size === 0) stopNet();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    targets.forEach((el) => observer.observe(el));

    // Safety net. No lower bound on the rect: anything already scrolled past
    // has effectively been seen, and leaving it hidden behind the reader is
    // the worst outcome.
    const sweep = () => {
      if (pending.size === 0) return stopNet();
      const limit = window.innerHeight * 0.92;
      for (const el of pending) {
        if (el.getBoundingClientRect().top < limit) {
          reveal(el);
          observer.unobserve(el);
          pending.delete(el);
        }
      }
      // The observer is doing its job — stop second-guessing it.
      if (observerWorks) stopNet();
    };

    function stopNet() {
      window.clearInterval(netTimer);
      netTimer = 0;
    }

    netTimer = window.setInterval(sweep, 400);
    sweep();

    return () => {
      observer.disconnect();
      stopNet();
    };
  }, []);

  return null;
}
