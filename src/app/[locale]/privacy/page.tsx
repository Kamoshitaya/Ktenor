import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { privacy } from "@/content/privacy";

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

  const doc = privacy[locale];

  return (
    <article className="container-page py-[var(--spacing-section)]">
      <div className="max-w-[68ch]">
        <h1 className="text-[length:var(--text-h1)]">{doc.title}</h1>
        <p className="mt-4 text-caption text-text-muted">{doc.updated}</p>
        <p className="mt-8 text-[length:var(--text-lead)] text-text-secondary">
          {doc.intro}
        </p>

        <div className="mt-[var(--spacing-block)] space-y-12">
          {doc.blocks.map((block) => (
            <section key={block.heading}>
              <h2 className="text-[length:var(--text-h3)]">{block.heading}</h2>
              <div className="mt-4 space-y-4">
                {block.body.map((paragraph) => (
                  <p key={paragraph} className="text-text-secondary">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
