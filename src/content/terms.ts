import type { Locale } from "@/i18n/config";
import type { LegalDoc } from "@/components/legal/LegalDocument";
import { site } from "@/lib/site";

/**
 * Terms of service. Business-to-business only, which is what keeps them this
 * short: between two businesses the Commercial Code governs and none of the
 * consumer-protection machinery applies — no 14-day withdrawal right, no ADR
 * notice, no consumer complaints procedure.
 *
 * Every commitment here is one the site already makes somewhere else, and
 * says the same thing: 50 % up front and 50 % before launch (the pricing
 * notes and the FAQ), revision rounds as stated in the quote, bug fixes never
 * billed as revisions, and "the website is yours" once paid. If the site's
 * promises change, this file changes in the same commit.
 *
 * Only published once the operator is registered (see site.operator): terms
 * that cannot name the party offering them are not terms. A plainly written
 * document, not legal advice — to be read by a lawyer before relying on it.
 */

const op = site.operator;
const updated = "22. 9. 2026";

const vatSk = op.vatPayer
  ? `Poskytovateľ je platiteľom DPH (IČ DPH ${op.vatId}); k cenám sa pripočíta DPH v zákonnej výške.`
  : "Poskytovateľ nie je platiteľom DPH, ceny sú preto konečné a nič sa k nim nepripočítava.";

const vatEn = op.vatPayer
  ? `The provider is registered for VAT (VAT ID ${op.vatId}); VAT is added to prices at the statutory rate.`
  : "The provider is not registered for VAT, so prices are final and nothing is added to them.";

const sk: LegalDoc = {
  title: "Obchodné podmienky",
  updated: `Platné od ${updated}`,
  intro: `Tieto obchodné podmienky upravujú tvorbu webových stránok a súvisiace služby, ktoré ${op.name} poskytuje pod značkou Ktenor. Služby sú určené výhradne podnikateľom a organizáciám.`,
  blocks: [
    {
      heading: "1. Poskytovateľ",
      body: [
        `${op.name}, miesto podnikania ${op.address}, IČO ${op.ico}, zápis: ${op.register} (ďalej „poskytovateľ“). Kontakt: ${site.contact.email}, ${site.contact.phoneDisplay}.`,
      ],
    },
    {
      heading: "2. Pre koho sú služby určené",
      body: [
        "Služby poskytujem len podnikateľom a právnickým osobám, ktoré objednávajú v rámci svojej podnikateľskej činnosti alebo činnosti organizácie. Klient to potvrdzuje pri odoslaní dopytu a prijatím ponuky.",
        "Vzťahy medzi poskytovateľom a klientom sa riadia týmito podmienkami a Obchodným zákonníkom (zákon č. 513/1991 Zb.). Ustanovenia o ochrane spotrebiteľa sa neuplatňujú.",
      ],
    },
    {
      heading: "3. Ako vzniká zmluva",
      body: [
        "Na dopyt odpovedám písomnou ponukou, ktorá obsahuje rozsah práce, cenu, termín a počet kôl úprav. Ceny uvedené na webe sú vstupné — záväzná je cena v ponuke.",
        "Zmluva vzniká, keď klient ponuku písomne prijme; stačí e-mail. Čokoľvek, čo sa v ponuke dohodne inak, má prednosť pred týmito podmienkami.",
      ],
    },
    {
      heading: "4. Cena a platba",
      body: [
        vatSk,
        "Platba prebieha v dvoch častiach: 50 % pred začatím práce a 50 % po dokončení, pred spustením webu. Obe časti sa hradia na základe faktúry so splatnosťou 14 dní, ak ponuka neurčuje inak.",
        "Práca sa začína po pripísaní prvej platby. Web spúšťam a odovzdávam po uhradení celej ceny.",
      ],
    },
    {
      heading: "5. Termín a spolupráca",
      body: [
        "Termín je uvedený v ponuke a plynie od úhrady prvej platby a dodania podkladov, bez ktorých sa nedá začať (texty, fotografie, logo, prístupy).",
        "Ak klient dodá podklady alebo spätnú väzbu neskôr, termín sa o toto oneskorenie predĺži. Ak termín ohrozí čokoľvek na mojej strane, klient sa to dozvie hneď, nie v deň odovzdania.",
        "Klient zodpovedá za to, že k dodaným textom, obrázkom a iným materiálom má potrebné práva.",
      ],
    },
    {
      heading: "6. Úpravy a oprava chýb",
      body: [
        "Počet kôl úprav je uvedený v ponuke. Ďalšie kolá sú spoplatnené podľa vopred dohodnutej ceny.",
        "Chyby vo funkčnosti, ktoré som spôsobil ja, opravím bezplatne aj po spustení — nie sú to úpravy a nikdy sa tak neúčtujú. Za chybu sa nepovažuje zmena zadania, zásah klienta alebo tretej osoby do webu ani výpadok služby tretej strany.",
      ],
    },
    {
      heading: "7. Odovzdanie",
      body: [
        "Pred spustením klient web skontroluje. Ak do 7 dní od výzvy neuvedie konkrétne výhrady, web sa považuje za prevzatý.",
      ],
    },
    {
      heading: "8. Práva k webu",
      body: [
        "Po úhrade celej ceny získava klient výhradnú, časovo a územne neobmedzenú licenciu na používanie, úpravu a ďalšie šírenie dodaného webu vrátane zdrojového kódu vytvoreného pre neho. Do úhrady celej ceny licencia nevzniká.",
        "Súčasti tretích strán — písma, knižnice, fotografie, pluginy — sa riadia vlastnými licenciami, na ktoré klienta upozorním.",
        "Hotový web môžem uvádzať vo svojom portfóliu, pokiaľ to klient písomne nezakáže.",
      ],
    },
    {
      heading: "9. Doména, hosting a podpora",
      body: [
        "Doménu a hosting zabezpečím ako doplnkovú službu, ak je to uvedené v ponuke; inak ich klient zabezpečuje sám. Za výpadky poskytovateľov týchto služieb nezodpovedám.",
        "Priebežná podpora po spustení je dobrovoľná a dojednáva sa samostatne; nie je súčasťou žiadneho balíka.",
      ],
    },
    {
      heading: "10. Zodpovednosť",
      body: [
        "Za škodu zodpovedám v rozsahu, ktorý určuje Obchodný zákonník. Nezodpovedám za škodu spôsobenú obsahom dodaným klientom, zásahmi klienta alebo tretích osôb do webu ani výpadkami služieb tretích strán.",
      ],
    },
    {
      heading: "11. Ukončenie spolupráce",
      body: [
        "Ak klient zruší objednávku po začatí práce, prvá platba sa nevracia v rozsahu už vykonanej práce; zvyšok vrátim.",
        "Od zmluvy môžem odstúpiť, ak klient napriek výzve neposkytne súčinnosť ani do 30 dní. Aj v takom prípade klient uhradí prácu vykonanú do dňa odstúpenia.",
      ],
    },
    {
      heading: "12. Záverečné ustanovenia",
      body: [
        "Spracúvanie osobných údajov opisuje stránka Ochrana osobných údajov.",
        "Tieto podmienky sa riadia právom Slovenskej republiky a spory rozhodujú súdy Slovenskej republiky. Ak sa slovenské a anglické znenie líšia, platí slovenské.",
      ],
    },
  ],
};

const en: LegalDoc = {
  title: "Terms of Service",
  updated: `Effective from ${updated}`,
  intro: `These terms govern the websites and related services ${op.name} provides under the Ktenor name. Services are offered exclusively to businesses and organisations. This is a translation; the Slovak version is binding.`,
  blocks: [
    {
      heading: "1. Provider",
      body: [
        `${op.name}, place of business ${op.address}, Company ID (IČO) ${op.ico}, registration: ${op.register} (the "provider"). Contact: ${site.contact.email}, ${site.contact.phoneDisplay}.`,
      ],
    },
    {
      heading: "2. Who the services are for",
      body: [
        "I provide services only to businesses and legal entities ordering in the course of their business or organisation. The client confirms this when sending an enquiry and when accepting a quote.",
        "The relationship is governed by these terms and the Slovak Commercial Code (Act No. 513/1991 Coll.). Consumer-protection provisions do not apply.",
      ],
    },
    {
      heading: "3. How a contract is formed",
      body: [
        "I answer an enquiry with a written quote setting out the scope, price, deadline and number of revision rounds. Prices shown on the website are starting prices — the price in the quote is binding.",
        "The contract is formed when the client accepts the quote in writing; an email is enough. Anything the quote agrees differently takes precedence over these terms.",
      ],
    },
    {
      heading: "4. Price and payment",
      body: [
        vatEn,
        "Payment is made in two parts: 50 % before work starts and 50 % on completion, before the website goes live. Both are paid against an invoice due within 14 days unless the quote says otherwise.",
        "Work starts once the first payment arrives. The website is launched and handed over once the full price is paid.",
      ],
    },
    {
      heading: "5. Deadlines and cooperation",
      body: [
        "The deadline is set in the quote and runs from the first payment and the delivery of the materials work cannot start without (copy, photographs, logo, access).",
        "If the client delivers materials or feedback late, the deadline moves by that delay. If anything on my side threatens the deadline, the client hears about it straight away, not on the day of delivery.",
        "The client is responsible for holding the necessary rights to any copy, images or other material they supply.",
      ],
    },
    {
      heading: "6. Revisions and bug fixes",
      body: [
        "The number of revision rounds is stated in the quote. Further rounds are charged at a price agreed in advance.",
        "Functional bugs I caused are fixed free of charge, including after launch — they are not revisions and are never billed as such. A change of brief, changes made to the site by the client or a third party, and outages of third-party services are not bugs.",
      ],
    },
    {
      heading: "7. Acceptance",
      body: [
        "Before launch the client reviews the website. If no specific objections are raised within 7 days of being asked, the website is deemed accepted.",
      ],
    },
    {
      heading: "8. Rights to the website",
      body: [
        "Once the full price is paid, the client receives an exclusive licence, unlimited in time and territory, to use, modify and distribute the delivered website, including the source code written for it. No licence arises before full payment.",
        "Third-party components — fonts, libraries, photographs, plugins — are governed by their own licences, which I will point out to the client.",
        "I may show the finished website in my portfolio unless the client forbids it in writing.",
      ],
    },
    {
      heading: "9. Domain, hosting and support",
      body: [
        "I arrange the domain and hosting as an add-on where the quote says so; otherwise the client arranges them. I am not liable for outages of those providers.",
        "Ongoing support after launch is optional and agreed separately; it is never part of a package.",
      ],
    },
    {
      heading: "10. Liability",
      body: [
        "I am liable for damage to the extent set by the Commercial Code. I am not liable for damage caused by content the client supplied, by changes made to the website by the client or third parties, or by outages of third-party services.",
      ],
    },
    {
      heading: "11. Ending the work",
      body: [
        "If the client cancels after work has started, the first payment is kept to the extent of the work already done; the rest is refunded.",
        "I may withdraw from the contract if the client fails to cooperate for 30 days despite being asked. In that case too, the client pays for the work done up to the date of withdrawal.",
      ],
    },
    {
      heading: "12. Final provisions",
      body: [
        "How personal data is processed is described on the Privacy Policy page.",
        "These terms are governed by the law of the Slovak Republic and disputes are decided by Slovak courts. Where the Slovak and English versions differ, the Slovak version prevails.",
      ],
    },
  ],
};

export const terms: Record<Locale, LegalDoc> = { sk, en };
