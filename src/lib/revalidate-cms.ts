import { revalidatePath } from "next/cache";
import { locales } from "@/i18n/config";

/**
 * The homepage is statically generated for speed, so a CMS edit (services,
 * FAQ, work) would otherwise sit invisible until the next code deployment.
 * Payload collection hooks call this after any change so the next visitor
 * gets a freshly rendered page instead of a stale one — same pattern as
 * revalidateReviewPages, just for /cms-driven content instead of reviews.
 */
export function revalidateHomepage() {
  for (const locale of locales) {
    revalidatePath(`/${locale}`);
  }
}
