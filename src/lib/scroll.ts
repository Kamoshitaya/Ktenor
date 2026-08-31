import type Lenis from "lenis";

let instance: Lenis | null = null;
let locks = 0;

/**
 * Scroll locking needs two parts. `lenis.stop()` blocks wheel-driven smooth
 * scroll, but Lenis (in its default, non-wrapper mode) doesn't intercept
 * native touch scrolling — on a phone the page underneath a locked overlay
 * (the mobile menu) could still be dragged with a finger, leaving it out of
 * sync with a header that assumes the page hasn't moved. `overflow: hidden`
 * on the body blocks that natively, and is safe to combine with Lenis here
 * (unlike a plain overflow-only lock) because unlockScroll already calls
 * `resize()` afterwards, so Lenis re-measures instead of keeping whatever
 * scroll-height it cached while the body was collapsed.
 *
 * Locks are counted, so the intro and the mobile menu overlapping cannot leave
 * the page unscrollable.
 */
export function registerLenis(next: Lenis | null) {
  instance = next;
}

export function lockScroll() {
  locks += 1;
  if (locks === 1) {
    instance?.stop();
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    instance?.start();
    // The layout may have changed while locked (intro removed, menu closed).
    instance?.resize();
  }
}

export function scrollToTarget(target: Element) {
  instance?.scrollTo(target as HTMLElement, { offset: -72 });
}
