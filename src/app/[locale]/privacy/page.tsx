import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { privacy } from "@/content/privacy";
import { LegalDocument } from "@/components/legal/LegalDocument";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const doc = privacy[locale];
  return {
    title: `${doc.title} — Ktenor`,
    description: doc.intro,
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: { sk: "/sk/privacy", en: "/en/privacy", "x-default": "/sk/privacy" },
    },
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <LegalDocument doc={privacy[locale]} />;
}
