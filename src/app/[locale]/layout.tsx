import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { clashDisplay, satoshi } from "@/fonts";
import { getDictionary } from "@/i18n";
import { isLocale, locales, localeTags, type Locale } from "@/i18n/config";
import { site } from "@/lib/site";
import { ThemeScript } from "@/components/theme/theme-script";
import { Intro } from "@/components/intro/Intro";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Reveal } from "@/components/motion/Reveal";
import { Cursor } from "@/components/motion/Cursor";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const t = await getDictionary(locale);
  const path = `/${locale}`;

  return {
    metadataBase: new URL(site.url),
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: path,
      languages: {
        sk: "/sk",
        en: "/en",
        "x-default": "/sk",
      },
    },
    openGraph: {
      type: "website",
      siteName: site.legalName,
      locale: localeTags[locale],
      title: t.meta.title,
      description: t.meta.description,
      url: path,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = await getDictionary(locale as Locale);

  return (
    <html
      lang={locale}
      data-theme="dark"
      /* No h-full here: it pins the document to the viewport height and the
         page cannot scroll at all. */
      className={`${clashDisplay.variable} ${satoshi.variable} no-js antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-dvh flex-col">
        {/* Two fixed layers behind everything: the gradient field and a grain
            pass over it. Neither ever repaints during scroll. */}
        <div aria-hidden className="bg-field" data-field>
          <div data-layer="dark" />
          <div data-layer="light" />
        </div>
        <div aria-hidden className="bg-grain" />
        <a
          href="#main"
          className="glass sr-only rounded-[var(--radius-sm)] px-4 py-2 focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[var(--z-modal)]"
        >
          {t.nav.skipToContent}
        </a>

        <Intro />
        <SmoothScroll />
        <Reveal />
        <Cursor />
        <Header locale={locale} t={t} />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer locale={locale} t={t} />
      </body>
    </html>
  );
}
