import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Internal reference page and the review-moderation tool — useful to
      // me, noise (or a login page) in search results.
      disallow: ["/sk/design", "/en/design", "/admin"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
