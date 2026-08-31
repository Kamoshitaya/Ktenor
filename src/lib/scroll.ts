import type Lenis from "lenis";

let instance: Lenis | null = null;
let locks = 0;

/**
 * Freezes the page in place while locked: stores the current scroll offset
 * and pins body there with `position: fixed`, rather than `overflow: hidden`.
 * That distinction matters on iOS Safari specifically — overflow:hidden on
 * html and body together is a known trigger for the whole page (including
 * elements that should stay interactive, like the menu's own close button)
 * going completely unresponsive to touch, not just unscrollable. A fixed
 * body has no such failure mode and is the standard cross-browser technique
 * for this.
 *
 * Also stops Lenis, since a fixed body doesn't stop it from still trying to
 * drive wheel-based smooth scroll underneath. unlockScroll restores the
 * exact scroll position before resuming Lenis and calling `resize()` (the
 * layout may have changed while locked — intro removed, menu closed).
 *
 * Locks are counted, so the intro and the mobile menu overlapping cannot leave
 * the page unscrollable.
 */
export function registerLenis(next: Lenis | null) {
  instance = next;
}

let savedScrollY = 0;

export function lockScroll() {
  locks += 1;
  if (locks === 1) {
    savedScrollY = window.scrollY;
    instance?.stop();
    document.body.style.position = "fixed";
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.width = "100%";
  }
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, savedScrollY);
    instance?.start();
    instance?.resize();
  }
}

export function scrollToTarget(target: Element) {
  instance?.scrollTo(target as HTMLElement, { offset: -72 });
}
