"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { DemoLocale, Localized } from "@/content/demo-dental/types";
import { DentalContext } from "./DentalContext";
import { localeStore } from "./localeStore";
import { hrefFor, viewFromPathname, type ViewId } from "./routes";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { DemoBanner } from "./DemoBanner";
import { HomeView } from "./views/HomeView";
import { ServicesView } from "./views/ServicesView";
import { TeamView } from "./views/TeamView";
import { BookingView } from "./views/BookingView";
import { ContactView } from "./views/ContactView";

const VIEWS: Record<ViewId, React.ComponentType> = {
  home: HomeView,
  services: ServicesView,
  team: TeamView,
  booking: BookingView,
  contact: ContactView,
};

export function DentalApp({ initialView }: { initialView: ViewId }) {
  const locale = useSyncExternalStore(
    localeStore.subscribe,
    localeStore.getSnapshot,
    localeStore.getServerSnapshot,
  );
  const [view, setView] = useState<ViewId>(initialView);
  const [pendingTreatmentId, setPendingTreatmentId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  /* Skip the scroll reset on first paint so a deep link does not jump. */
  const mounted = useRef(false);

  const setLocale = useCallback((next: DemoLocale) => localeStore.set(next), []);

  /* Keeps <html lang> in step for screen readers and hyphenation. */
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const go = useCallback((next: ViewId, options?: { treatmentId?: string }) => {
    /*
     * pushState has to happen here, in the event handler, and never inside a
     * setState updater: React is free to run updaters during render, and
     * mutating history mid-render updates the Next router while this component
     * is rendering — which React reports as "Cannot update a component while
     * rendering a different component".
     */
    const href = hrefFor(next);
    if (window.location.pathname !== href) {
      window.history.pushState({ view: next }, "", href);
    }

    setPendingTreatmentId(options?.treatmentId ?? null);
    setView(next);
  }, []);

  /* Browser back and forward drive the same state the links do. */
  useEffect(() => {
    const onPopState = () => setView(viewFromPathname(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, [view, reduceMotion]);

  const t = useCallback((value: Localized) => value[locale], [locale]);

  const contextValue = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      view,
      go,
      pendingTreatmentId,
    }),
    [locale, setLocale, t, view, go, pendingTreatmentId],
  );

  const Current = VIEWS[view];

  return (
    <DentalContext.Provider value={contextValue}>
      <DemoBanner />
      <Header />

      <main id="rb-main" tabIndex={-1} className="outline-none">
        {/*
          mode="wait" holds the incoming page until the outgoing one has
          finished leaving, so the two never overlap mid-fade.
        */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
            transition={{
              duration: reduceMotion ? 0 : 0.34,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Current />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </DentalContext.Provider>
  );
}
