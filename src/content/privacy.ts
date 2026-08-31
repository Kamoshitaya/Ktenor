import type { Locale } from "@/i18n/config";

type Block = { heading: string; body: string[] };
type PrivacyDoc = { title: string; updated: string; intro: string; blocks: Block[] };

/**
 * Describes only what the site actually does — no clause here describes
 * something that isn't real. Every processor actually in use (Resend,
 * Google Sheets, Neon/Vercel for the CMS and the reviews database) is named
 * plainly, with the legal basis, retention and rights language a GDPR notice
 * needs (controller identity, the DPA complaint right, international
 * transfers) rather than left out or left as boilerplate. When any of that
 * changes — a new processor, analytics being added, a new form — this
 * document is updated in the same commit, not after the fact.
 *
 * This is a plainly written document, not legal advice; it should be
 * reviewed by a professional before the studio takes on real client work.
 */
const en: PrivacyDoc = {
  title: "Privacy Policy",
  updated: "Last updated: 1 September 2026",
  intro:
    "Ktenor is a one-person digital studio based in Bratislava, Slovakia. I respect your privacy and collect only the information needed to respond to enquiries, provide services, operate the website and prevent abuse. This page explains what personal data I process, why, where it may be stored, and what rights you have under the General Data Protection Regulation (GDPR).",
  blocks: [
    {
      heading: "Who is responsible for this",
      body: [
        "The controller responsible for the processing described on this page is Ktenor, a one-person digital studio based in Bratislava, Slovakia — reachable directly at ktenorstudio@gmail.com.",
        "If you have a question about your personal data, or would like to request access, correction, restriction or deletion, contact me at that address.",
      ],
    },
    {
      heading: "What information the website collects",
      body: [
        "The website itself is designed to collect as little personal information as possible.",
        "When you browse it, the hosting and infrastructure providers it runs on may automatically process certain technical information — things like IP address, browser and device information, timestamps, and other technical data necessary to deliver, secure and maintain the site.",
        "This information is not used by me for advertising, profiling or analytics.",
      ],
    },
    {
      heading: "The contact form",
      body: [
        "When you submit an enquiry, I process exactly what you choose to provide: your name; your email address; your phone number, if given; the service you selected; a budget range, if given; a preferred timeline, if given; and your message. Nothing else is collected, and nothing is taken from your device beyond what you typed.",
        "The form also processes a hidden technical field and the time it took to complete. Both exist solely to detect and prevent automated spam, and neither is used to identify or profile you.",
        "This information is used to respond to your enquiry, discuss a potential project, provide the services you've requested, and communicate with you about any work that follows from it.",
        "It may be sent by email, stored in a private spreadsheet, and saved in the website's own admin panel — so an enquiry isn't lost if any one of the three becomes unavailable. If you leave an email address, an automatic confirmation may be sent back to it.",
      ],
    },
    {
      heading: "Legal basis for processing",
      body: [
        "Depending on the circumstances, I process enquiry information on one or more of the following legal bases under the GDPR: taking steps at your request before entering into a contract, when you contact me about a potential project; performance of a contract, when processing is necessary to provide an agreed service; legitimate interests, where necessary to operate, secure and maintain the website and prevent spam or abuse; and consent, where processing is specifically based on it.",
        "Where processing is based on consent, you may withdraw it at any time. Withdrawal does not affect the lawfulness of processing carried out before it.",
      ],
    },
    {
      heading: "Cookies and local storage",
      body: [
        "The website stores a small number of functional preferences on your device: your selected language and your selected colour theme. They are used only to make the site behave according to your choices, are read only by this site, and are never linked to you as a person.",
        "The website also temporarily remembers whether the intro animation has already been shown. That is kept only for the current browser session and disappears when the session ends.",
        "I do not use cookies or similar technology for advertising, behavioural profiling or third-party analytics. Because the only stored data is a functional preference you set yourself, no cookie consent banner is required. Clearing your browser data removes any locally stored preferences.",
      ],
    },
    {
      heading: "Analytics and tracking",
      body: [
        "There are none. No Google Analytics, no advertising pixels, no behavioural advertising, no cross-site tracking, no third-party profiling services — no analytics system is used to build a profile of visitors.",
      ],
    },
    {
      heading: "Service providers",
      body: [
        "I use a limited number of third-party providers to operate the website and handle enquiries.",
        "Vercel hosts and deploys the website, and may process technical information generated when visitors access it — IP addresses, device and browser information, timestamps and other server-related data necessary to provide and secure its services.",
        "Resend delivers the emails generated by the contact form. For data processed on my behalf, Resend acts as a data processor under its own Data Processing Addendum; its primary processing and storage takes place in the United States, and transfers from the EEA are covered by Standard Contractual Clauses and its participation in the EU-U.S. Data Privacy Framework. Resend may separately process account, billing and usage information under its own privacy policy.",
        "Google Sheets holds a private record of enquiries, which I use to manage them and any resulting client work.",
        "The website's own admin panel (its CMS) uses a database hosted by Neon, provisioned through Vercel, to store enquiry data and the reviews described below.",
        "These providers process information under their own legal obligations and service-specific privacy policies. I use them only where necessary to operate the website and provide its services, and none of them use your data for their own purposes.",
      ],
    },
    {
      heading: "International transfers",
      body: [
        "Some of these providers may process personal data outside the European Economic Area, including in the United States. Where that happens, I rely on legally recognised safeguards — an adequacy decision, Standard Contractual Clauses, or another lawful transfer mechanism, as required by the GDPR. Resend, for example, covers EEA-to-US transfers through Standard Contractual Clauses and its participation in the EU-U.S. Data Privacy Framework.",
      ],
    },
    {
      heading: "How long information is kept",
      body: [
        "I keep personal information only for as long as reasonably necessary for the purpose it was collected for. Enquiry information may be retained while an enquiry, project or related business relationship is ongoing, and for as long as reasonably necessary afterwards to maintain business records, resolve disputes, or meet legal obligations.",
        "You may request deletion of your personal data at any time, subject to cases where I am legally required or permitted to retain it. Third-party providers may have their own retention periods for information processed through their services.",
      ],
    },
    {
      heading: "Reviews",
      body: [
        "Submitting a review sends your name, your star rating, the optional text you write, and the language you submitted it in.",
        "Reviews are kept private at first and are never published automatically — a review goes live only after I've checked and approved it, and I may make small edits for length, clarity or formatting before publishing. Rejected or unpublished reviews are deleted once they are no longer needed, rather than kept indefinitely.",
      ],
    },
    {
      heading: "If you contact me directly",
      body: [
        "Email, phone and WhatsApp messages are kept only as long as reasonably necessary to handle the conversation and any work that follows from it. Your contact information is not added to a marketing mailing list without an appropriate legal basis, and is not shared with anyone.",
      ],
    },
    {
      heading: "Your rights under the GDPR",
      body: [
        "Depending on the circumstances and applicable legal conditions, you have the right to: request access to your personal data; request correction of inaccurate or incomplete data; request deletion of your personal data; request restriction of processing; object to certain processing; request data portability where applicable; withdraw consent where processing is based on it; and lodge a complaint with a data protection supervisory authority.",
        "In practice, the only personal data I hold is what you have sent me directly. To exercise any of these rights, write to ktenorstudio@gmail.com and it will be handled.",
      ],
    },
    {
      heading: "Right to complain",
      body: [
        "If you believe your personal data has been processed unlawfully, you have the right to lodge a complaint with the relevant supervisory authority. In Slovakia, that is the Úrad na ochranu osobných údajov Slovenskej republiky, Galvaniho 7/B, 821 04 Bratislava, Slovak Republic (dataprotection.gov.sk), which is responsible for supervising personal-data protection here.",
      ],
    },
    {
      heading: "Security",
      body: [
        "I take reasonable technical and organisational measures to protect personal information against unauthorised access, loss, misuse or disclosure. That said, no method of transmitting or storing information online can be guaranteed to be completely secure.",
      ],
    },
    {
      heading: "Changes",
      body: [
        "If the way I process personal data changes — new analytics, a new integration, a new form — this page is updated in the same release, not afterwards, and the \"Last updated\" date above changes with it.",
      ],
    },
  ],
};

const sk: PrivacyDoc = {
  title: "Ochrana osobných údajov",
  updated: "Naposledy aktualizované: 1. septembra 2026",
  intro:
    "Ktenor je jednoosobové digitálne štúdio so sídlom v Bratislave. Rešpektujem vaše súkromie a zbieram len informácie potrebné na odpovedanie na dopyty, poskytovanie služieb, prevádzku webu a zabránenie zneužitiu. Táto stránka vysvetľuje, aké osobné údaje spracúvam, prečo, kde môžu byť uložené a aké práva máte podľa Všeobecného nariadenia o ochrane údajov (GDPR).",
  blocks: [
    {
      heading: "Kto je za to zodpovedný",
      body: [
        "Prevádzkovateľom zodpovedným za spracúvanie opísané na tejto stránke je Ktenor, jednoosobové digitálne štúdio so sídlom v Bratislave — dosiahnuteľné priamo na ktenorstudio@gmail.com.",
        "Ak máte otázku ohľadom svojich osobných údajov, alebo by ste chceli požiadať o prístup, opravu, obmedzenie či vymazanie, napíšte mi na túto adresu.",
      ],
    },
    {
      heading: "Aké informácie web zbiera",
      body: [
        "Samotný web je navrhnutý tak, aby zbieral čo najmenej osobných informácií.",
        "Pri jeho prehliadaní môžu poskytovatelia hostingu a infraštruktúry, na ktorých beží, automaticky spracúvať určité technické informácie — napríklad IP adresu, informácie o prehliadači a zariadení, časové značky a ďalšie technické údaje potrebné na doručenie, zabezpečenie a údržbu webu.",
        "Tieto informácie nepoužívam na reklamu, profilovanie ani analytiku.",
      ],
    },
    {
      heading: "Kontaktný formulár",
      body: [
        "Pri odoslaní dopytu spracúvam presne to, čo sa rozhodnete uviesť: vaše meno; e-mailovú adresu; telefónne číslo, ak ho uvediete; zvolenú službu; rozpočtový rozsah, ak ho uvediete; preferovaný termín, ak ho uvediete; a vašu správu. Nič ďalšie sa nezbiera a z vášho zariadenia sa neberie nič nad rámec toho, čo ste napísali.",
        "Formulár tiež spracúva skryté technické pole a čas, ktorý trvalo jeho vyplnenie. Oboje slúži výlučne na odhalenie a zabránenie automatizovanému spamu a nič z toho sa nepoužíva na vašu identifikáciu ani profilovanie.",
        "Tieto informácie slúžia na odpovedanie na váš dopyt, prediskutovanie prípadného projektu, poskytnutie požadovaných služieb a komunikáciu s vami o prípadnej ďalšej práci.",
        "Môžu byť odoslané e-mailom, uložené v súkromnej tabuľke a uložené vo vlastnej administrácii webu — aby sa dopyt nestratil, ak by niektorý z týchto troch spôsobov zlyhal. Ak necháte e-mailovú adresu, môže vám naň prísť automatické potvrdenie.",
      ],
    },
    {
      heading: "Právny základ spracúvania",
      body: [
        "V závislosti od okolností spracúvam informácie z dopytu na základe jedného alebo viacerých z týchto právnych základov podľa GDPR: vykonanie krokov na vašu žiadosť pred uzavretím zmluvy, keď ma kontaktujete ohľadom prípadného projektu; plnenie zmluvy, keď je spracúvanie potrebné na poskytnutie dohodnutej služby; oprávnený záujem, keď je to potrebné na prevádzku, zabezpečenie a údržbu webu a na zabránenie spamu či zneužitiu; a súhlas, ak sa spracúvanie zakladá konkrétne naň.",
        "Ak sa spracúvanie zakladá na súhlase, môžete ho kedykoľvek odvolať. Odvolanie nemá vplyv na zákonnosť spracúvania vykonaného pred jeho odvolaním.",
      ],
    },
    {
      heading: "Cookies a lokálne úložisko",
      body: [
        "Web ukladá do vášho zariadenia malý počet funkčných nastavení: zvolený jazyk a zvolenú farebnú tému. Slúžia len na to, aby sa web správal podľa vašich volieb, číta ich len tento web a nie sú spojené s vašou osobou.",
        "Web si tiež dočasne pamätá, či už bola zobrazená úvodná animácia. Toto sa ukladá len na dobu aktuálnej relácie prehliadača a zmizne po jej skončení.",
        "Nepoužívam cookies ani podobné technológie na reklamu, behaviorálne profilovanie ani analytiku tretích strán. Keďže jediné uložené údaje sú funkčné nastavenie, ktoré ste si zvolili sami, súhlas s cookies nie je potrebný. Vymazaním údajov prehliadača odstránite akékoľvek lokálne uložené nastavenia.",
      ],
    },
    {
      heading: "Analytika a sledovanie",
      body: [
        "Žiadne nie sú. Žiadny Google Analytics, žiadne reklamné pixely, žiadna behaviorálna reklama, žiadne sledovanie naprieč webmi, žiadne profilovacie služby tretích strán — na profilovanie návštevníkov nepoužívam žiadny analytický systém.",
      ],
    },
    {
      heading: "Poskytovatelia služieb",
      body: [
        "Na prevádzku webu a spracovanie dopytov využívam obmedzený počet poskytovateľov tretích strán.",
        "Vercel hostuje a nasadzuje web a môže spracúvať technické informácie vznikajúce pri návšteve webu — IP adresy, informácie o zariadení a prehliadači, časové značky a ďalšie serverové údaje potrebné na poskytovanie a zabezpečenie svojich služieb.",
        "Resend doručuje e-maily generované kontaktným formulárom. Pri údajoch spracúvaných v mojom mene vystupuje Resend ako sprostredkovateľ podľa vlastnej zmluvy o spracúvaní údajov (DPA); jeho hlavné spracúvanie a uchovávanie prebieha v USA a prenosy z EHP pokrývajú štandardné zmluvné doložky (SCC) a jeho účasť v rámci EU-U.S. Data Privacy Framework. Resend môže samostatne spracúvať účtovné, fakturačné a prevádzkové údaje podľa vlastných zásad ochrany súkromia.",
        "Google Sheets uchováva súkromný záznam dopytov, ktorý používam na ich správu a prípadnú súvisiacu klientsku prácu.",
        "Vlastná administrácia webu (jeho CMS) využíva databázu hostenú spoločnosťou Neon, sprostredkovanú cez Vercel, na uloženie údajov z dopytov a recenzií opísaných nižšie.",
        "Títo poskytovatelia spracúvajú informácie podľa vlastných zákonných povinností a vlastných zásad ochrany súkromia. Využívam ich len tam, kde je to potrebné na prevádzku webu a poskytovanie jeho služieb, a žiadny z nich nevyužíva vaše údaje na vlastné účely.",
      ],
    },
    {
      heading: "Medzinárodné prenosy",
      body: [
        "Niektorí z týchto poskytovateľov môžu spracúvať osobné údaje mimo Európskeho hospodárskeho priestoru, vrátane USA. Tam, kde k tomu dochádza, sa spolieham na právne uznané záruky — rozhodnutie o primeranosti, štandardné zmluvné doložky alebo iný zákonný mechanizmus prenosu, ako to vyžaduje GDPR. Resend napríklad pokrýva prenosy z EHP do USA štandardnými zmluvnými doložkami a účasťou v rámci EU-U.S. Data Privacy Framework.",
      ],
    },
    {
      heading: "Ako dlho informácie uchovávam",
      body: [
        "Osobné informácie uchovávam len tak dlho, ako je primerane potrebné na účel, na ktorý boli zozbierané. Informácie z dopytu môžu byť uchovávané, kým dopyt, projekt alebo súvisiaci obchodný vzťah trvá, a potom ešte tak dlho, ako je primerane potrebné na vedenie obchodných záznamov, riešenie sporov alebo splnenie zákonných povinností.",
        "Kedykoľvek môžete požiadať o vymazanie svojich osobných údajov, s výnimkou prípadov, kde som zo zákona povinný alebo oprávnený si ich ponechať. Poskytovatelia tretích strán môžu mať pre údaje spracúvané cez ich služby vlastné doby uchovávania.",
      ],
    },
    {
      heading: "Recenzie",
      body: [
        "Odoslaním recenzie sa uloží vaše meno, hodnotenie hviezdičkami, nepovinný text, ktorý napíšete, a jazyk, v ktorom ste ju odoslali.",
        "Recenzie sú spočiatku súkromné a nikdy sa nezverejňujú automaticky — recenzia sa zverejní až po tom, čo ju skontrolujem a schválim, a pred zverejnením ju môžem mierne upraviť kvôli dĺžke, zrozumiteľnosti alebo formátovaniu. Zamietnuté alebo nezverejnené recenzie mažem, keď už nie sú potrebné, namiesto toho, aby som ich uchovával donekonečna.",
      ],
    },
    {
      heading: "Ak ma kontaktujete priamo",
      body: [
        "E-maily, telefonáty a správy cez WhatsApp uchovávam len tak dlho, ako je primerane potrebné na vybavenie konverzácie a prípadnej práce, ktorá z nej vyplynie. Vaše kontaktné údaje nepridávam do žiadneho marketingového zoznamu bez zodpovedajúceho právneho základu a nezdieľam ich s nikým.",
      ],
    },
    {
      heading: "Vaše práva podľa GDPR",
      body: [
        "V závislosti od okolností a platných právnych podmienok máte právo: požiadať o prístup k svojim osobným údajom; požiadať o opravu nepresných alebo neúplných údajov; požiadať o vymazanie svojich osobných údajov; požiadať o obmedzenie spracúvania; namietať proti určitému spracúvaniu; požiadať o prenosnosť údajov, ak je to relevantné; odvolať súhlas, ak sa spracúvanie naň zakladá; a podať sťažnosť dozornému orgánu na ochranu osobných údajov.",
        "V praxi jediné osobné údaje, ktoré mám, sú tie, ktoré ste mi poslali priamo. Na uplatnenie ktoréhokoľvek z týchto práv napíšte na ktenorstudio@gmail.com a vybavím to.",
      ],
    },
    {
      heading: "Právo podať sťažnosť",
      body: [
        "Ak sa domnievate, že vaše osobné údaje boli spracované nezákonne, máte právo podať sťažnosť príslušnému dozornému orgánu. Na Slovensku je ním Úrad na ochranu osobných údajov Slovenskej republiky, Galvaniho 7/B, 821 04 Bratislava (dataprotection.gov.sk), ktorý je zodpovedný za dohľad nad ochranou osobných údajov na Slovensku.",
      ],
    },
    {
      heading: "Bezpečnosť",
      body: [
        "Prijímam primerané technické a organizačné opatrenia na ochranu osobných informácií pred neoprávneným prístupom, stratou, zneužitím alebo únikom. Žiadny spôsob prenosu ani ukladania informácií online však nemožno zaručiť ako úplne bezpečný.",
      ],
    },
    {
      heading: "Zmeny",
      body: [
        "Ak sa spôsob, akým spracúvam osobné údaje, zmení — nová analytika, nová integrácia, nový formulár — táto stránka sa aktualizuje v tom istom vydaní, nie dodatočne, a spolu s ňou sa zmení aj dátum „Naposledy aktualizované“ uvedený vyššie.",
      ],
    },
  ],
};

export const privacy: Record<Locale, PrivacyDoc> = { en, sk };
