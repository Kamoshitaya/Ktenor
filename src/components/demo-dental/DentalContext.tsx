"use client";

import { createContext, useContext } from "react";
import type { DemoLocale, Localized } from "@/content/demo-dental/types";
import type { ViewId } from "./routes";

export type DentalContextValue = {
  locale: DemoLocale;
  setLocale: (locale: DemoLocale) => void;
  /** Reads the current language out of a Localized value. */
  t: (value: Localized) => string;
  view: ViewId;
  /** Client-side navigation that keeps the address bar honest. */
  go: (view: ViewId, options?: { treatmentId?: string }) => void;
  /**
   * Set when arriving at Booking or Services from a specific treatment link.
   * Views read it once, in a useState initialiser, rather than syncing to it in
   * an effect; go() overwrites it on every navigation, so it never goes stale
   * and nothing has to clear it.
   */
  pendingTreatmentId: string | null;
};

export const DentalContext = createContext<DentalContextValue | null>(null);

export function useDental(): DentalContextValue {
  const value = useContext(DentalContext);
  if (!value) throw new Error("useDental must be used inside DentalApp");
  return value;
}
