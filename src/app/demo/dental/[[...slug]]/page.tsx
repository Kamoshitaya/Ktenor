import { DentalApp } from "@/components/demo-dental/DentalApp";
import { viewFromSlug, viewIds } from "@/components/demo-dental/routes";

/**
 * One catch-all route backs all five pages.
 *
 * App Router unmounts the outgoing page before the incoming one renders, which
 * makes a real exit animation impossible. Rendering every view from a single
 * route hands that control to AnimatePresence instead — the outgoing page can
 * animate away properly — while the URLs stay real, shareable and
 * back-button-friendly rather than being faked with a hash.
 */
export function generateStaticParams() {
  return viewIds.map((id) => (id === "home" ? { slug: [] } : { slug: [id] }));
}

export default async function DentalPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  return <DentalApp initialView={viewFromSlug(slug)} />;
}
