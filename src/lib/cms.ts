import { getPayload } from "payload";
import config from "@payload-config";
import type { Locale } from "@/i18n/config";
import type { Faq, Service } from "@/cms/payload-types";

async function payload() {
  return getPayload({ config });
}

export type ServicePackage = Service;
export type ServiceAddon = Service;

/** Split by isAddon rather than two collections — same shape, different rendering. */
export async function getServices(
  locale: Locale,
): Promise<{ packages: ServicePackage[]; addons: ServiceAddon[] }> {
  const p = await payload();
  const { docs } = await p.find({
    collection: "services",
    locale,
    sort: "order",
    limit: 200,
    pagination: false,
  });
  return {
    packages: docs.filter((d) => !d.isAddon),
    addons: docs.filter((d) => d.isAddon),
  };
}

export async function getFaqItems(locale: Locale): Promise<Faq[]> {
  const p = await payload();
  const { docs } = await p.find({
    collection: "faq",
    locale,
    sort: "order",
    limit: 200,
    pagination: false,
  });
  return docs;
}
