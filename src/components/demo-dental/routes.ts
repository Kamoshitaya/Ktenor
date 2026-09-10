import type { Localized } from "@/content/demo-dental/types";
import { copy } from "@/content/demo-dental/copy";

export const BASE_PATH = "/demo/dental";

export const viewIds = ["home", "services", "team", "booking", "contact"] as const;
export type ViewId = (typeof viewIds)[number];

/** Path segment under the base path; home has none. */
const SEGMENTS: Record<ViewId, string> = {
  home: "",
  services: "services",
  team: "team",
  booking: "booking",
  contact: "contact",
};

export const navLabels: Record<ViewId, Localized> = {
  home: copy.nav.home,
  services: copy.nav.services,
  team: copy.nav.team,
  booking: copy.nav.booking,
  contact: copy.nav.contact,
};

export function hrefFor(view: ViewId): string {
  const segment = SEGMENTS[view];
  return segment ? `${BASE_PATH}/${segment}` : BASE_PATH;
}

/** Maps the catch-all slug (or a full pathname) back to a view. */
export function viewFromSlug(slug: string[] | undefined): ViewId {
  const first = slug?.[0];
  if (!first) return "home";
  const match = viewIds.find((id) => SEGMENTS[id] === first);
  return match ?? "home";
}

export function viewFromPathname(pathname: string): ViewId {
  const rest = pathname.replace(BASE_PATH, "").replace(/^\/+|\/+$/g, "");
  return viewFromSlug(rest ? rest.split("/") : undefined);
}
