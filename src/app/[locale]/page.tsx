import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n";
import { isLocale } from "@/i18n/config";
import { getFaqItems, getServices, type ServicePackage } from "@/lib/cms";
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

const emptyServices = { packages: [] as ServicePackage[], addons: [] as ServicePackage[] };

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = await getDictionary(locale);
  const [services, faqItems] = await Promise.all([
    getServices(locale).catch(() => emptyServices),
    getFaqItems(locale).catch(() => []),
  ]);

  return (
    <>
      <Hero t={t} />
      <Work t={t} />
      <Services t={t} services={services} />
      <Process t={t} />
      <Principles t={t} />
      <Advantages t={t} />
      <Testimonials t={t} locale={locale} />
      <Faq t={t} items={faqItems} />
      <CtaBand t={t} />
      <Contact t={t} locale={locale} services={services.packages} />
    </>
  );
}
