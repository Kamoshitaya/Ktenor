"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { lockScroll, unlockScroll } from "@/lib/scroll";

/** Below this the screen would flicker rather than read as an intro. */
const MIN_VISIBLE = 900;
/** Above this the visitor waits on us, which is never worth it. */
const MAX_WAIT = 4000;
const BAR_STEP = 120;

export const INTRO_FLAG = "ktenor-intro";

/**
 * Not a splash screen — the mark is one object that ends up in the header.
 * The three bars track real readiness (hydration, fonts, poster decoded), so
 * the progress is honest rather than a fixed animation pretending to load.
 *
 * Shown once per session. Repeat views are suppressed before first paint by
 * the pre-paint script, so returning visitors never see it flash.
 */
export function Intro() {
  const [stage, setStage] = useState<"idle" | "running" | "leaving" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const markRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;

    if (root.dataset.intro === "done") {
      setStage("done");
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const started = performance.now();
    let cancelled = false;

    const finish = () => {
      if (cancelled) return;
      root.dataset.intro = "done";
      try {
        sessionStorage.setItem(INTRO_FLAG, "done");
      } catch {
        /* private mode — the intro simply plays again next time */
      }
      unlockScroll();
      setStage("done");
      document.getElementById("main")?.focus({ preventScroll: true });
    };

    if (reduced) {
      // No choreography, just get out of the way.
      setStage("leaving");
      const timer = window.setTimeout(finish, 200);
      return () => {
        cancelled = true;
        window.clearTimeout(timer);
      };
    }

    lockScroll();
    setStage("running");

    // Three real milestones, one per bar.
    const milestones: Promise<unknown>[] = [
      Promise.resolve(),
      document.fonts?.ready ?? Promise.resolve(),
      decodePoster(),
    ];

    let reached = 0;
    milestones.forEach((milestone, index) => {
      void milestone.then(() => {
        if (cancelled) return;
        reached += 1;
        // Bars never light out of order, however the promises settle.
        window.setTimeout(() => !cancelled && setProgress(reached), index * BAR_STEP);
      });
    });

    const leave = () => {
      if (cancelled) return;
      setProgress(3);
      flyToHeader(markRef.current);
      setStage("leaving");
      window.setTimeout(finish, 700);
    };

    const all = Promise.all(milestones);
    const ceiling = new Promise((resolve) => window.setTimeout(resolve, MAX_WAIT));

    void Promise.race([all, ceiling]).then(() => {
      const elapsed = performance.now() - started;
      window.setTimeout(leave, Math.max(0, MIN_VISIBLE - elapsed));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (stage === "done") return null;

  return (
    <div
      ref={rootRef}
      id="intro"
      aria-hidden
      className="fixed inset-0 z-[var(--z-intro)] grid place-items-center bg-[#0b0c11] transition-transform duration-[700ms] ease-[var(--ease-out-expo)]"
      style={{ transform: stage === "leaving" ? "translateY(-101%)" : "translateY(0)" }}
    >
      <div
        ref={markRef}
        className="transition-[opacity,transform,filter] duration-[450ms] ease-[var(--ease-out-expo)]"
        style={{
          opacity: stage === "idle" ? 0 : 1,
          transform: stage === "idle" ? "scale(0.96)" : "scale(1)",
          filter: stage === "idle" ? "blur(6px)" : "blur(0px)",
        }}
      >
        <Logo variant="compact" className="h-24 w-auto text-[#eeeff4]" />

        <div data-intro-bars className="mt-8 flex justify-center gap-1.5">
          {[0, 1, 2].map((bar) => (
            <span
              key={bar}
              className="h-1 w-7 rounded-full transition-[background-color] duration-[320ms] ease-[var(--ease-standard)]"
              style={{
                background:
                  progress > bar
                    ? ["#6e8fc4", "#46618f", "#2a3a55"][bar]
                    : "rgb(238 239 244 / 0.12)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** The hero poster is the heaviest thing above the fold; wait for it, not for a timer. */
function decodePoster(): Promise<unknown> {
  const image = new Image();
  image.src = "/media/hero-poster.webp";
  return image.decode().catch(() => undefined);
}

/**
 * The mark does not fade out — it travels to the header logo, so the intro
 * reads as the page assembling around it rather than a curtain being pulled.
 */
function flyToHeader(mark: HTMLElement | null) {
  if (!mark) return;
  const glyph = mark.querySelector<SVGElement>("svg");
  const bars = mark.querySelector<HTMLElement>("[data-intro-bars]");
  const target = document.querySelector<HTMLElement>("[data-logo-target]");
  if (!glyph || !target) return;

  const easing = "cubic-bezier(0.16, 1, 0.3, 1)";

  // The bars have done their job; they leave first so the glyph travels alone.
  bars?.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: 220,
    easing,
    fill: "forwards",
  });

  const from = glyph.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const scale = to.height / (from.height || 1);

  glyph.animate(
    [
      { transform: "translate(0px, 0px) scale(1)" },
      {
        transform: `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${scale})`,
      },
    ],
    { duration: 620, easing, fill: "forwards" },
  );
}
