import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n";
import { isLocale } from "@/i18n/config";
import { Hero } from "@/components/sections/Hero";
import { Work } from "@/components/sections/Work";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Principles } from "@/components/sections/Principles";
import { Advantages } from "@/components/sections/Advantages";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { CtaBand } from "@/components/sections/CtaBand";
import { Contact } from "@/components/sections/Contact";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = await getDictionary(locale);

  return (
    <>
      <Hero t={t} />
      <Work t={t} />
      <Services t={t} />
      <Process t={t} />
      <Principles t={t} />
      <Advantages t={t} />
      <Testimonials t={t} locale={locale} />
      <Faq t={t} />
      <CtaBand t={t} />
      <Contact t={t} locale={locale} />
    </>
  );
}
