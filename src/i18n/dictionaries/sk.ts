import type { Dictionary } from "./en";

/**
 * Slovak copy. Typed against the English dictionary so nothing can be left
 * untranslated. Needs a native proof-read before launch.
 */
const sk: Dictionary = {
  meta: {
    title: "Ktenor — Prémiové weby, navrhnuté a postavené od začiatku do konca",
    description:
      "Ktenor navrhuje a stavia prémiové weby od nuly: landing pages, firemné weby a e-shopy. Jeden človek od prvého náčrtu až po spustenie.",
    ogAlt: "Ktenor — webové štúdio",
  },

  nav: {
    work: "Práce",
    services: "Služby",
    process: "Postup",
    about: "O mne",
    reviews: "Recenzie",
    faq: "Časté otázky",
    contact: "Kontakt",
    menu: "Menu",
    openMenu: "Otvoriť menu",
    closeMenu: "Zavrieť menu",
    skipToContent: "Preskočiť na obsah",
  },

  actions: {
    startProject: "Začať projekt",
    seeWork: "Pozrieť práce",
    order: "Objednať",
    tellMeMore: "Povedzte mi o svojom projekte",
    backHome: "Späť na úvod",
  },

  theme: {
    toggle: "Prepnúť tému",
    toDark: "Prepnúť na tmavú tému",
    toLight: "Prepnúť na svetlú tému",
  },

  language: {
    label: "Jazyk",
    switchTo: "Prepnúť na angličtinu",
  },

  hero: {
    eyebrow: "Webové štúdio",
    headline: "Prémiové weby, navrhnuté a postavené od začiatku do konca.",
    sub: "Za každým projektom stojí jeden človek — od prvého náčrtu až po spustený web. Žiadne šablóny, žiadne odovzdávanie, žiadne kompromisy v detailoch.",
  },

  work: {
    eyebrow: "Práce",
    title: "Klientske projekty.",
    intro:
      "Klientske projekty zatiaľ chýbajú, tak sú tu aspoň ukážky — fiktívne podniky, navrhnuté a naprogramované od začiatku do konca rovnako ako pri skutočnej zákazke.",
    projects: {
      cafe: {
        name: "Ember & Oak",
        description:
          "Jednostránkový web pre fiktívnu bratislavskú kaviareň: menu, galéria interiéru, recenzie a kontakt — ukážka hotového produktu.",
        cta: "Pozrieť živé demo",
      },
      barbershop: {
        name: "Forge & Blade",
        description:
          "Jednostránkový web pre fiktívne bratislavské holičstvo: služby, galéria, tím, recenzie a plnohodnotný ukážkový rezervačný formulár.",
        cta: "Pozrieť živé demo",
      },
    },
    comingSoon: "Ďalšie ukážkové projekty čoskoro.",
  },

  services: {
    eyebrow: "Služby",
    title: "Čo staviam.",
    intro:
      "Každý projekt navrhujem a programujem od nuly. Nižšie sú vstupné ceny — konečná suma závisí od rozsahu.",
    from: "od",
    onRequest: "Na vyžiadanie",
    timeline: "Termín",
    whatsIncluded: "Čo je súčasťou",
    includedTitle: "Súčasťou každého projektu",
    included: [
      "Dizajn od nuly — žiadne šablóny",
      "Responzívnosť na všetkých zariadeniach",
      "Základné SEO od prvého dňa",
      "Optimalizovaný výkon pred spustením",
      "Premyslené animácie a mikrointerakcie",
      "Dve kolá úprav",
    ],
    addonsTitle: "Doplnky",
    addonsIntro: "Účtujú sa zvlášť, aby ceny vyššie zostali poctivé.",
    payment: "50 % vopred, 50 % po dokončení — pred spustením webu.",
    disclaimer:
      "Vstupné ceny sú orientačné. Konečná cena závisí od rozsahu projektu, funkcionality a požiadaviek.",
    enquiry: {
      title: "Neviete, čo si vybrať?",
      description:
        "Väčšina projektov neprichádza označená. Opíšte vlastnými slovami, čo potrebujete, a ja sa ozvem s rozsahom aj cenou.",
    },
  },

  process: {
    eyebrow: "Postup",
    title: "Ako projekt prebieha.",
    intro:
      "Šesť fáz, žiadne prekvapenia. Viete, čo sa práve deje, čo nasleduje a v akom stave projekt je.",
    hint: "Prejdite kurzorom pre viac",
    steps: {
      analysis: {
        name: "Analýza",
        description:
          "Pre koho je web, čo má dosiahnuť a v čom je konkurencia dobrá. Rozhodnutia sú tým lacnejšie, čím skôr padnú.",
      },
      planning: {
        name: "Plánovanie",
        description:
          "Štruktúra, zoznam stránok, cesta návštevníka. Kostru schválite skôr, než sa začne kresliť.",
      },
      design: {
        name: "Dizajn",
        description:
          "Kompozícia, typografia, farba a pohyb — navrhnuté pre váš obsah, nie vložené do šablóny.",
      },
      development: {
        name: "Vývoj",
        description:
          "Čistý, moderný kód. Responzívny od prvého commitu, nie dorobený na konci.",
      },
      testing: {
        name: "Testovanie",
        description:
          "Každý breakpoint, reálne zariadenia, ovládanie klávesnicou, kontrast a rýchlosť. Nájdem to ja, nie vaši zákazníci.",
      },
      launch: {
        name: "Spustenie",
        description:
          "Doména, hosting, indexácia a spoločná záverečná kontrola. Potom je web váš.",
      },
    },
  },

  principles: {
    eyebrow: "Princípy",
    title: "Ako pracujem.",
    intro: "Priamo, bez sprostredkovateľov — a so zodpovednosťou za výsledok.",
    items: {
      honesty: {
        name: "Radšej úprimne než pohodlne",
        description:
          "Ak nápad nebude fungovať, poviem to skôr, než vás to bude stáť peniaze — nie potom.",
      },
      deadlines: {
        name: "Termíny, ktoré držia",
        description:
          "Termín je záväzok. Ak ho niečo ohrozí, viete o tom včas, nie v deň odovzdania.",
      },
      details: {
        name: "Detail ako štandard",
        description:
          "Hover stavy, fokus, prázdne stavy, nesprávna veľkosť obrazovky. Časti, ktoré nikto neukazuje.",
      },
      quality: {
        name: "Kvalita pred kvantitou",
        description:
          "Naraz menej projektov. Ten váš nie je položka v poradí.",
      },
      result: {
        name: "Výsledok pred procesom",
        description:
          "Nikto si nekupuje wireframy. Rozhoduje to, čo hotový web urobí pre vás.",
      },
      transparency: {
        name: "Nič skryté",
        description:
          "Jasná cena, jasný rozsah, jasný stav. Vždy viete, za čo platíte.",
      },
    },
  },

  advantages: {
    eyebrow: "Prečo Ktenor",
    title: "Jeden človek. Od začiatku do konca.",
    intro:
      "Hovoríte priamo s tým, kto web navrhuje, programuje aj spúšťa. Nič sa nestratí medzi manažérom, dizajnérom a vývojárom — pretože je to ten istý človek.",
    items: {
      direct: {
        name: "Priamy kontakt",
        description:
          "Žiadni account manažéri, žiadne odovzdávanie, žiadne „overím to s tímom“.",
      },
      stack: {
        name: "Moderné technológie",
        description:
          "Aktuálne nástroje, nie skladačka stránok. Web zostane udržateľný dlho po spustení.",
      },
      performance: {
        name: "Postavené na rýchlosť",
        description:
          "Výkon je tu podmienkou dizajnu, nie optimalizáciou na konci.",
      },
      responsive: {
        name: "Každá obrazovka",
        description:
          "Telefón, tablet, notebook, desktop — navrhnuté pre každý, nie natlačené do jedného.",
      },
      seo: {
        name: "SEO od prvého dňa",
        description:
          "Štruktúra, metadáta a indexácia riešené počas stavby, nie dolepené neskôr.",
      },
      bespoke: {
        name: "Nič z police",
        description:
          "Web kreslím pre váš obsah. Žiadna téma, žiadny recyklovaný layout.",
      },
    },
  },

  testimonials: {
    eyebrow: "Referencie",
    title: "Čo hovoria klienti.",
    intro: "Skutočné hodnotenia zo skutočných projektov — moderované, nikdy neupravované.",
    emptyTitle: "Buďte prvý, kto pridá recenziu.",
    emptyBody: "Zatiaľ žiadne recenzie — sekcia sa naplní, keď sa dokončia prvé projekty.",
    leaveReview: "Pridať recenziu",
    seeAll: "Zobraziť všetky recenzie",
  },

  reviews: {
    title: "Čo hovoria klienti.",
    intro:
      "Každá recenzia tu pochádza od niekoho, kto so mnou skutočne spolupracoval. Odoslané recenzie sa pred zverejnením kontrolujú, takže to, čo čítate, je skutočné.",
    formTitle: "Pridať recenziu",
    formIntro: "Stačí hodnotenie — pár slov o projekte je vítaných, ale nepovinných.",
    fields: {
      name: "Meno",
      namePlaceholder: "Ako sa má zobraziť?",
      rating: "Hodnotenie",
      quote: "Pár slov o projekte",
      quotePlaceholder: "Nepovinné — čo vás zaujalo?",
      optional: "nepovinné",
      required: "povinné",
    },
    submit: "Odoslať recenziu",
    sending: "Odosielam…",
    success: {
      title: "Ďakujem — recenzia je na ceste.",
      body: "Zverejní sa po kontrole, zvyčajne do jedného dňa.",
    },
    failure: {
      title: "Odoslanie zlyhalo.",
      body: "Niečo sa pokazilo cestou. Skúste to znova alebo ma kontaktujte priamo.",
    },
    errors: {
      name: "Zadajte prosím svoje meno.",
      rating: "Vyberte prosím hodnotenie.",
    },
    consent: {
      label: "Súhlasím so spracovaním osobných údajov",
      link: "Ochrana osobných údajov",
    },
  },

  faq: {
    eyebrow: "Časté otázky",
    title: "Skôr než sa spýtate.",
  },

  cta: {
    title: "Máte niečo v hlave?",
    description:
      "Menej projektov, plná pozornosť. Povedzte mi, čo potrebujete, a dostanete priamu odpoveď na rozsah, termín aj cenu.",
  },

  contact: {
    eyebrow: "Kontakt",
    title: "Začnime projekt.",
    intro:
      "Vyplňte, čo viete. Na začiatok stačí meno, e-mail a telefónne číslo.",
    fields: {
      name: "Meno",
      email: "E-mail",
      phone: "Telefón",
      dialCodeLabel: "Predvoľba krajiny",
      phoneNumberPlaceholder: "911 608 486",
      phoneNumberPlaceholderOther: "Celé číslo s predvoľbou krajiny",
      service: "Čo potrebujete?",
      servicePlaceholder: "Vyberte službu",
      budget: "Rozpočet",
      budgetPlaceholder: "Vyberte rozsah",
      timeline: "Želaný termín",
      message: "O projekte",
      messagePlaceholder: "Na čo má slúžiť, čo má robiť, čokoľvek už viete.",
      optional: "nepovinné",
      required: "povinné",
      recommended: "odporúčané",
    },
    countries: {
      SK: "Slovensko",
      CZ: "Česko",
      AT: "Rakúsko",
      HU: "Maďarsko",
      PL: "Poľsko",
      DE: "Nemecko",
      GB: "Veľká Británia",
      IE: "Írsko",
      US: "USA",
      OTHER: "Iná krajina",
    },
    budgets: {
      under500: "Do 500 €",
      "500to1500": "500 – 1 500 €",
      "1500to3000": "1 500 – 3 000 €",
      over3000: "3 000 € a viac",
    },
    consent: {
      label: "Súhlasím so spracovaním osobných údajov",
      link: "Ochrana osobných údajov",
    },
    submit: "Odoslať dopyt",
    sending: "Odosielam…",
    success: {
      title: "Ďakujem — vaša správa dorazila.",
      body: "Odpovedám osobne, spravidla do jedného pracovného dňa. Ak ste nechali e-mail, potvrdenie je už na ceste k vám.",
    },
    failure: {
      title: "Odoslanie zlyhalo.",
      body: "Niečo sa pokazilo cestou. Skúste to znova alebo ma kontaktujte priamo — oboje končí na rovnakom mieste.",
      retry: "Skúsiť znova",
    },
    rateLimit: "Príliš veľa pokusov za krátky čas. Počkajte pár minút alebo ma kontaktujte priamo.",
    errors: {
      name: "Zadajte prosím svoje meno.",
      email: "Táto e-mailová adresa nevyzerá správne.",
      phone: "Toto telefónne číslo nevyzerá správne.",
      service: "Vyberte prosím, čo potrebujete.",
      consent: "Potvrďte prosím súhlas so spracovaním údajov.",
    },
    direct: "Alebo mi napíšte priamo",
  },

  footer: {
    tagline: "Prémiové weby, navrhnuté a postavené od začiatku do konca.",
    navTitle: "Navigácia",
    contactTitle: "Kontakt",
    settingsTitle: "Nastavenia",
    social: "Sociálne siete",
    rights: "Všetky práva vyhradené.",
    privacy: "Ochrana osobných údajov",
    location: "Bratislava, Slovensko — pracujem na diaľku po celej krajine",
  },

  notFound: {
    title: "Táto stránka neexistuje.",
    description: "Adresa je nesprávna alebo sa stránka presunula. Tadiaľto späť.",
    services: "Služby",
    work: "Práce",
    orWrite: "Alebo mi jednoducho napíšte",
  },

  error: {
    title: "Niečo sa pokazilo.",
    description: "Nastala neočakávaná chyba. Skúste to znova alebo ma kontaktujte priamo.",
    retry: "Skúsiť znova",
  },
};

export default sk;
