import type { Locale } from "@/i18n/config";

type Block = { heading: string; body: string[] };
type PrivacyDoc = { title: string; updated: string; intro: string; blocks: Block[] };

/**
 * Describes only what the site actually does. No cookie-consent language, no
 * analytics clauses, no third-party processors — because none of those exist
 * yet. When the contact form is wired up or analytics is added, this document
 * gets updated in the same commit.
 *
 * This is a plainly written document, not legal advice; it should be reviewed
 * by a professional before launch.
 */
const en: PrivacyDoc = {
  title: "Privacy Policy",
  updated: "Last updated: 8 August 2026",
  intro:
    "This site collects as little as possible. Below is exactly what happens to any information it touches — nothing is described here that the site does not actually do.",
  blocks: [
    {
      heading: "What is stored on your device",
      body: [
        "Two preferences are saved locally so the site behaves the way you left it: your chosen language and your chosen colour theme.",
        "They are stored in a cookie on your own device, are read only by this site, and are never sent anywhere or linked to you as a person. Clearing your browser data removes them.",
      ],
    },
    {
      heading: "Analytics and tracking",
      body: [
        "There are none. No analytics service, no advertising pixels, no third-party trackers, no profiling and no cross-site identifiers.",
        "Because the only stored data is a functional preference you set yourself, no cookie consent banner is required.",
      ],
    },
    {
      heading: "The contact form",
      body: [
        "When you submit the enquiry form, it sends exactly what you filled in: your name, the email address and phone number you chose to give, the service you selected, the budget range and timeline if you set them, and your message. Nothing else is collected, and nothing is taken from your device beyond what you typed.",
        "That information is used for one purpose — replying to your enquiry and carrying out any work that follows from it. It is emailed to me and recorded in a private spreadsheet so an enquiry cannot be lost if an email fails to arrive. If you leave an email address, an automatic confirmation is sent back to you.",
        "Two service providers handle this on my behalf: Resend delivers the email, and Google Sheets stores the record. Neither uses your data for their own purposes. Enquiries are kept only as long as they are relevant, and you can ask for yours to be deleted at any time.",
        "The form also carries a hidden field and measures how long it took to complete. Both exist only to filter out automated spam, and neither identifies you.",
      ],
    },
    {
      heading: "Reviews",
      body: [
        "Submitting a review sends your name, star rating and the optional line of text you write. It is stored in a database along with the language you submitted in, and starts out visible only to me while I check it.",
        "A submitted review is never shown on the site automatically — it is published only after I approve it, and I may edit it for length or clarity before doing so. Rejected or unpublished reviews stay off the site and are deleted rather than kept indefinitely.",
        "The database is hosted by Neon, provisioned through Vercel; it does not use your data for its own purposes.",
      ],
    },
    {
      heading: "If you contact me directly",
      body: [
        "Email, phone and WhatsApp messages are kept only as long as needed to handle the conversation and any work that follows from it. They are not added to a mailing list and are not shared with anyone.",
      ],
    },
    {
      heading: "Hosting",
      body: [
        "The site is hosted on Vercel, which processes standard server request data such as IP address and browser type in order to deliver the pages. This is a technical necessity of serving any website and is not used by me for analytics or profiling.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "Under the GDPR you may request access to any personal data held about you, ask for it to be corrected or deleted, or object to its processing.",
        "In practice, the only personal data I hold is what you have sent me directly. Write to me and it will be handled.",
      ],
    },
    {
      heading: "Changes",
      body: [
        "If the site starts doing something new — analytics, a live form, an integration — this page is updated in the same release, not afterwards.",
      ],
    },
  ],
};

const sk: PrivacyDoc = {
  title: "Ochrana osobných údajov",
  updated: "Naposledy aktualizované: 8. augusta 2026",
  intro:
    "Tento web zbiera čo najmenej. Nižšie je presne to, čo sa deje s informáciami, ktorých sa dotkne — nie je tu opísané nič, čo web v skutočnosti nerobí.",
  blocks: [
    {
      heading: "Čo sa ukladá vo vašom zariadení",
      body: [
        "Lokálne sa ukladajú dve nastavenia, aby sa web správal tak, ako ste ho opustili: zvolený jazyk a zvolená farebná téma.",
        "Sú uložené v cookie priamo vo vašom zariadení, číta ich len tento web, nikam sa neodosielajú a nie sú spojené s vašou osobou. Vymazaním údajov prehliadača zmiznú.",
      ],
    },
    {
      heading: "Analytika a sledovanie",
      body: [
        "Žiadne nie sú. Žiadna analytická služba, žiadne reklamné pixely, žiadne sledovače tretích strán, žiadne profilovanie ani identifikátory naprieč webmi.",
        "Keďže jediné uložené údaje sú funkčné nastavenie, ktoré ste si zvolili sami, súhlas s cookies nie je potrebný.",
      ],
    },
    {
      heading: "Kontaktný formulár",
      body: [
        "Pri odoslaní formulára sa odošle presne to, čo ste vyplnili: meno, e-mail a telefón, ktoré ste sa rozhodli uviesť, zvolená služba, rozpočet a termín, ak ste ich nastavili, a vaša správa. Nič ďalšie sa nezbiera a z vášho zariadenia sa neberie nič nad rámec toho, čo ste napísali.",
        "Tieto údaje slúžia na jediný účel — odpovedať na váš dopyt a prípadne realizovať prácu, ktorá z neho vyplynie. Posielajú sa mi e-mailom a zaznamenávajú sa do súkromnej tabuľky, aby sa dopyt nestratil, ak by e-mail nedorazil. Ak necháte e-mailovú adresu, príde vám naň automatické potvrdenie.",
        "Pomáhajú s tým dvaja poskytovatelia: Resend doručuje e-mail a Google Sheets uchováva záznam. Ani jeden nepoužíva vaše údaje na vlastné účely. Dopyty uchovávam len dovtedy, kým sú relevantné, a kedykoľvek môžete požiadať o ich vymazanie.",
        "Formulár tiež obsahuje skryté pole a meria, ako dlho trvalo jeho vyplnenie. Oboje slúži výlučne na filtrovanie automatického spamu a ani jedno vás neidentifikuje.",
      ],
    },
    {
      heading: "Recenzie",
      body: [
        "Odoslaním recenzie sa uloží vaše meno, hodnotenie hviezdičkami a nepovinný text, ktorý napíšete. Ukladá sa do databázy spolu s jazykom, v ktorom ste ju odoslali, a spočiatku ju vidím len ja pri kontrole.",
        "Odoslaná recenzia sa na webe nezobrazí automaticky — zverejním ju až po schválení a pred zverejnením ju môžem upraviť kvôli dĺžke alebo zrozumiteľnosti. Zamietnuté alebo nezverejnené recenzie na webe nikdy nie sú a namiesto trvalého uchovávania ich mažem.",
        "Databázu hostí Neon, sprostredkovaná cez Vercel; vaše údaje nevyužíva na vlastné účely.",
      ],
    },
    {
      heading: "Ak ma kontaktujete priamo",
      body: [
        "E-maily, telefonáty a správy cez WhatsApp uchovávam len tak dlho, ako je potrebné na vybavenie konverzácie a prípadnej práce, ktorá z nej vyplynie. Nepridávam ich do žiadnej databázy na rozosielanie a nezdieľam ich s nikým.",
      ],
    },
    {
      heading: "Hosting",
      body: [
        "Web je hosťovaný na platforme Vercel, ktorá na doručenie stránok spracúva bežné údaje o požiadavke, ako IP adresa a typ prehliadača. Je to technická nevyhnutnosť prevádzky akéhokoľvek webu a nevyužívam ju na analytiku ani profilovanie.",
      ],
    },
    {
      heading: "Vaše práva",
      body: [
        "Podľa GDPR môžete požiadať o prístup k osobným údajom, ktoré o vás mám, o ich opravu alebo vymazanie, prípadne namietať proti ich spracúvaniu.",
        "V praxi jediné osobné údaje, ktoré mám, sú tie, ktoré ste mi poslali priamo. Napíšte mi a vybavím to.",
      ],
    },
    {
      heading: "Zmeny",
      body: [
        "Ak web začne robiť niečo nové — analytiku, funkčný formulár, integráciu — táto stránka sa aktualizuje v tom istom vydaní, nie dodatočne.",
      ],
    },
  ],
};

export const privacy: Record<Locale, PrivacyDoc> = { en, sk };
