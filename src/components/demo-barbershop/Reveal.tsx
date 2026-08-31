"use client";

import { useEffect } from "react";

const SELECTOR = "[data-reveal]";

/**
 * One-shot scroll reveal. Falls back to showing everything if IO is
 * unavailable.
 *
 * A plain querySelectorAll at mount only catches what's already in the DOM
 * — content mounted later (a tab switch, a submitted form's confirmation
 * panel) would never be observed and stay stuck at opacity 0 forever. A
 * MutationObserver catches those as they appear.
 */
export function Reveal() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || typeof IntersectionObserver === "undefined") {
      const revealAll = () => {
        document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => el.setAttribute("data-revealed", ""));
      };
      revealAll();
      const mo = new MutationObserver(revealAll);
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    const observeNew = (root: ParentNode) => {
      root.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        if (!el.hasAttribute("data-revealed")) observer.observe(el);
      });
    };

    observeNew(document);

    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches(SELECTOR)) observer.observe(node);
          observeNew(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
