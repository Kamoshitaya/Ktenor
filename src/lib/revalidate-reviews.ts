import { revalidatePath } from "next/cache";
import { locales } from "@/i18n/config";

/**
 * The homepage and /reviews are statically generated for speed, which means
 * a review approved in the admin page would otherwise sit invisible until
 * the next code deployment — the data changes, but the cached HTML doesn't
 * know that. Call this after any action that changes what's publicly
 * visible (approve, reject, edit, delete, or the owner adding one directly)
 * so the next visitor gets a freshly rendered page instead of a stale one.
 */
export function revalidateReviewPages() {
  for (const locale of locales) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/reviews`);
  }
}
