import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { terms } from "@/content/terms";
import { hasOperator } from "@/lib/site";
import { LegalDocument } from "@/components/legal/LegalDocument";

/*
 * Terms that cannot name the business offering them are not terms, so until
 * the operator is filled in (src/lib/site.ts) this route is a plain 404 and
 * nothing on the site links to it.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || !hasOperator) return {};
  const doc = terms[locale];
  return {
    title: `${doc.title} — Ktenor`,
    description: doc.intro,
    alternates: {
      canonical: `/${locale}/terms`,
      languages: { sk: "/sk/terms", en: "/en/terms", "x-default": "/sk/terms" },
    },
    robots: { index: true, follow: true },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || !hasOperator) notFound();

  return <LegalDocument doc={terms[locale]} />;
}
