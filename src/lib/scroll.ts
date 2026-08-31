import type Lenis from "lenis";

let instance: Lenis | null = null;
let locks = 0;

/**
 * Scroll locking has to go through Lenis, not `body { overflow: hidden }`.
 * Lenis measures the scrollable height when it starts and clamps to it — lock
 * the body underneath it and it caches a limit of zero, leaving the page stuck
 * at the top for good.
 *
 * Locks are counted, so the intro and the mobile menu overlapping cannot leave
 * the page unscrollable.
 */
export function registerLenis(next: Lenis | null) {
  instance = next;
}

export function lockScroll() {
  locks += 1;
  if (locks === 1) instance?.stop();
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    instance?.start();
    // The layout may have changed while locked (intro removed, menu closed).
    instance?.resize();
  }
}

export function scrollToTarget(target: Element) {
  instance?.scrollTo(target as HTMLElement, { offset: -72 });
}
