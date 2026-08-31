"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Deliberately quiet: a dot that tracks exactly and a ring that lags a little
 * and opens over anything interactive. No trail, no magnetism, no labels —
 * an over-eager cursor is the fastest way to make a premium page feel cheap.
 *
 * Two things keep it free during scroll. The animation loop stops as soon as
 * the ring has caught up and only restarts on movement, so a still pointer
 * costs nothing — and a pointer is still for most of a scroll. Hover state
 * comes from pointerover/pointerout delegation rather than a `closest()` walk
 * on every single move event.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    setEnabled(true);
    document.documentElement.dataset.cursor = "custom";

    const interactive =
      'a, button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])';

    const pointer = { x: innerWidth / 2, y: innerHeight / 2 };
    const ring = { ...pointer };
    let frame = 0;
    let visible = false;

    const tick = () => {
      const dx = pointer.x - ring.x;
      const dy = pointer.y - ring.y;

      // Settled: park the loop until something moves again.
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        ring.x = pointer.x;
        ring.y = pointer.y;
        frame = 0;
        return;
      }

      // Light easing — enough to feel physical, not enough to feel laggy.
      ring.x += dx * 0.18;
      ring.y += dy * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        // The independent `translate` property, not `transform`. The ring is
        // scaled on hover via the independent `scale` property, and the
        // browser applies translate → rotate → scale → transform in that fixed
        // order. Putting the position in `transform` left it *inside* the
        // scale, so a 1.45 hover multiplied the coordinates and threw the ring
        // sideways — further the further right the pointer was. Using
        // `translate` puts the two in the correct order.
        ringRef.current.style.translate = `calc(${ring.x}px - 50%) calc(${ring.y}px - 50%)`;
      }
      frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (frame === 0) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;

      if (!visible) {
        visible = true;
        dotRef.current?.style.setProperty("opacity", "1");
        ringRef.current?.style.setProperty("opacity", "1");
      }
      wake();
    };

    const onOver = (event: PointerEvent) => {
      const hit = (event.target as HTMLElement | null)?.closest?.(interactive);
      if (hit) ringRef.current?.setAttribute("data-open", "");
    };

    const onOut = (event: PointerEvent) => {
      const left = (event.target as HTMLElement | null)?.closest?.(interactive);
      const entering = (event.relatedTarget as HTMLElement | null)?.closest?.(interactive);
      if (left && !entering) ringRef.current?.removeAttribute("data-open");
    };

    const onLeave = () => {
      visible = false;
      dotRef.current?.style.setProperty("opacity", "0");
      ringRef.current?.style.setProperty("opacity", "0");
    };

    const onDown = () => ringRef.current?.setAttribute("data-press", "");
    const onUp = () => ringRef.current?.removeAttribute("data-press");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      delete document.documentElement.dataset.cursor;
    };
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[var(--z-cursor)]">
      <div
        ref={dotRef}
        className="fixed left-0 top-0 size-[5px] rounded-full bg-text opacity-0 transition-opacity duration-[var(--dur-base)]"
      />
      <div
        ref={ringRef}
        data-cursor-ring
        className="fixed left-0 top-0 size-8 rounded-full border border-line-strong opacity-0"
      />
    </div>
  );
}
