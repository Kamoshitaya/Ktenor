import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { site } from "@/lib/site";

const paths = ["", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${site.url}/${locale}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? ("monthly" as const) : ("yearly" as const),
      priority: path === "" ? 1 : 0.3,
      alternates: {
        languages: Object.fromEntries(
          locales.map((alt) => [alt, `${site.url}/${alt}${path}`]),
        ),
      },
    })),
  );
}
