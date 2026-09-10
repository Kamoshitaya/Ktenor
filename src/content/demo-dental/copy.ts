import type { Localized } from "./types";

/**
 * Every string the interface draws, in both languages. Data-shaped rather than
 * split into two files so a new label cannot be added in one language only.
 */
export const copy = {
  nav: {
    home: { sk: "Domov", en: "Home" },
    services: { sk: "Služby", en: "Services" },
    team: { sk: "Náš tím", en: "Our team" },
    booking: { sk: "Objednanie", en: "Booking" },
    contact: { sk: "Kontakt", en: "Contact" },
    openMenu: { sk: "Otvoriť menu", en: "Open menu" },
    closeMenu: { sk: "Zavrieť menu", en: "Close menu" },
    skipToContent: { sk: "Preskočiť na obsah", en: "Skip to content" },
  },

  common: {
    book: { sk: "Objednať sa", en: "Book a visit" },
    bookLong: { sk: "Objednať návštevu", en: "Book a visit" },
    from: { sk: "od", en: "from" },
    back: { sk: "Späť", en: "Back" },
    continue: { sk: "Pokračovať", en: "Continue" },
    change: { sk: "Zmeniť", en: "Change" },
    years: { sk: "rokov praxe", en: "years of experience" },
    speaks: { sk: "Hovorí", en: "Speaks" },
    demoNotice: {
      sk: "Ukážkový web — objednávka sa nikam neodosiela.",
      en: "Demo site — nothing you submit is sent anywhere.",
    },
  },

  home: {
    heroEyebrow: { sk: "Rodinná zubná ambulancia v Bratislave", en: "Family dental practice in Bratislava" },
    heroTitle: {
      sk: "Zubár, ku ktorému sa deti vracajú rady",
      en: "The dentist your kids won't dread",
    },
    heroLead: {
      sk: "Sme malá rodinná ambulancia v Starom Meste. Prehliadky, detská stomatológia, estetika aj implantáty — pre celú rodinu na jednom mieste, bez ponáhľania.",
      en: "We're a small family practice in the Old Town. Check-ups, kids' dentistry, cosmetic work and implants — the whole family in one place, and never rushed.",
    },
    heroSecondary: { sk: "Pozrieť služby a ceny", en: "See services & prices" },

    whyTitle: { sk: "Prečo si nás rodiny vyberajú", en: "Why families choose us" },
    whyLead: {
      sk: "Štyri veci, ktoré počujeme od pacientov najčastejšie.",
      en: "The four things patients bring up most often.",
    },
    why: [
      {
        title: { sk: "Celá rodina u jedného lekára", en: "One practice for everyone" },
        text: {
          sk: "Od prvého zúbka po implantáty. Termíny pre viacerých členov rodiny dáme za sebou v jedno popoludnie.",
          en: "From a first tooth to implants. We line several family members up back to back in one afternoon.",
        },
      },
      {
        title: { sk: "Cenu poviete vopred", en: "The price comes first" },
        text: {
          sk: "Pred každým ošetrením dostanete rozpis. Žiadne položky, o ktorých sa dozviete až pri platbe.",
          en: "You get an itemised estimate before treatment starts. No line items that appear at the till.",
        },
      },
      {
        title: { sk: "Bez ponáhľania", en: "Time to talk" },
        text: {
          sk: "Prehliadka trvá tridsať minút, nie desať. Je čas na otázky aj na to, aby si dieťa zvyklo.",
          en: "A check-up takes thirty minutes, not ten. There's room for questions, and for a child to settle in.",
        },
      },
      {
        title: { sk: "Miesta pre akútne prípady", en: "Same-day for pain" },
        text: {
          sk: "Každý deň držíme voľné termíny. Keď zabolí, nečakáte na budúci týždeň.",
          en: "We keep slots free every single day. When it hurts, you're not waiting until next week.",
        },
      },
    ],

    toothTitle: { sk: "Kde to bolí?", en: "Where does it hurt?" },
    toothLead: {
      sk: "Otočte modelom a kliknite na zub — ukážeme, aké ošetrenie k nemu najčastejšie patrí.",
      en: "Spin the model and tap a tooth — we'll show which treatment it usually calls for.",
    },
    toothHint: { sk: "Ťahajte pre otočenie", en: "Drag to rotate" },
    toothCta: { sk: "Zobraziť ošetrenie", en: "See the treatment" },

    servicesTitle: { sk: "Čo u nás vyriešite", en: "What we take care of" },
    servicesLead: {
      sk: "Päť oblastí, v ktorých pokrývame bežnú aj náročnejšiu starostlivosť.",
      en: "Five areas covering everyday care and the more involved work alike.",
    },
    servicesCta: { sk: "Všetky služby a ceny", en: "All services & prices" },

    reviewsTitle: { sk: "Čo hovoria pacienti", en: "What patients say" },
    reviewsLead: { sk: "Hodnotenia z Google, priemer", en: "Google reviews, averaging" },

    ctaTitle: { sk: "Objednáte sa za dve minúty", en: "Booking takes two minutes" },
    ctaLead: {
      sk: "Vyberiete ošetrenie, lekára a termín. Ozveme sa vám a potvrdíme ho.",
      en: "Pick a treatment, a dentist and a time. We'll call you back to confirm it.",
    },
  },

  services: {
    title: { sk: "Služby a cenník", en: "Services & prices" },
    lead: {
      sk: "Ceny uvádzame v rozpätí, pretože každý zub je iný. Konkrétnu sumu dostanete pred ošetrením, nie po ňom.",
      en: "Prices are shown as ranges because no two teeth are alike. You get the exact figure before treatment, not after.",
    },
    allCategories: { sk: "Všetko", en: "Everything" },
    calculatorTitle: { sk: "Orientačná kalkulačka", en: "Cost estimator" },
    calculatorLead: {
      sk: "Označte, čo vás zaujíma, a uvidíte približnú sumu. Slúži na orientáciu, nie ako cenová ponuka.",
      en: "Tick what you're considering and see a rough total. It's for orientation, not a quotation.",
    },
    calcTeeth: { sk: "Počet zubov", en: "Number of teeth" },
    calcTeethHint: {
      sk: "Vzťahuje sa len na ošetrenia účtované za zub.",
      en: "Applies only to treatments charged per tooth.",
    },
    calcInsurance: { sk: "Mám poistenie s príspevkom na stomatológiu", en: "My insurance contributes to dental care" },
    calcInsuranceHint: {
      sk: "Odpočíta orientačných 15 % z preventívnych výkonov.",
      en: "Takes a nominal 15% off preventive treatments.",
    },
    calcEmpty: {
      sk: "Zatiaľ nič nie je označené. Vyberte ošetrenie a suma sa objaví tu.",
      en: "Nothing selected yet. Pick a treatment and the total appears here.",
    },
    calcTotal: { sk: "Odhad spolu", en: "Estimated total" },
    calcPerTooth: { sk: "za zub", en: "per tooth" },
    calcInsuranceLine: { sk: "Zľava poistenia", en: "Insurance contribution" },
    calcDisclaimer: {
      sk: "Len orientačný odhad — konečnú cenu potvrdíme na konzultácii.",
      en: "Estimate only — the final price is confirmed at your consultation.",
    },
    calcReset: { sk: "Vyčistiť výber", en: "Clear selection" },
  },

  team: {
    title: { sk: "Ľudia, ktorí sa o vás postarajú", en: "The people who'll look after you" },
    lead: {
      sk: "Päť ľudí, malá ambulancia. Uvidíte stále tie isté tváre — aj o päť rokov.",
      en: "Five people, one small practice. You'll see the same faces — five years from now too.",
    },
    filterAll: { sk: "Celý tím", en: "Whole team" },
    bookWith: { sk: "Objednať sa k lekárovi", en: "Book with them" },
  },

  booking: {
    title: { sk: "Objednanie termínu", en: "Book an appointment" },
    lead: {
      sk: "Štyri kroky. Termín vám telefonicky potvrdíme do nasledujúceho pracovného dňa.",
      en: "Four steps. We confirm your slot by phone within the next working day.",
    },
    steps: [
      { sk: "Ošetrenie", en: "Treatment" },
      { sk: "Lekár", en: "Dentist" },
      { sk: "Termín", en: "Time" },
      { sk: "Kontakt", en: "Details" },
    ],
    stepOf: { sk: "Krok", en: "Step" },
    of: { sk: "z", en: "of" },

    step1Title: { sk: "Čo potrebujete vyriešiť?", en: "What do you need?" },
    step2Title: { sk: "Ku komu sa chcete objednať?", en: "Who would you like to see?" },
    step2Any: { sk: "Ktorýkoľvek voľný lekár", en: "Whoever is free first" },
    step2AnyHint: { sk: "Najskorší možný termín", en: "Gets you the earliest slot" },
    step3Title: { sk: "Kedy sa vám to hodí?", en: "When suits you?" },
    step4Title: { sk: "Kam sa vám ozveme?", en: "How do we reach you?" },

    morning: { sk: "Dopoludnia", en: "Morning" },
    afternoon: { sk: "Popoludní", en: "Afternoon" },
    noSlots: {
      sk: "V tento deň už nie je voľno. Skúste iný termín.",
      en: "Nothing left on this day. Try another one.",
    },
    slotTaken: { sk: "Obsadené", en: "Taken" },
    closedDay: { sk: "Zatvorené", en: "Closed" },

    name: { sk: "Meno a priezvisko", en: "Full name" },
    phone: { sk: "Telefón", en: "Phone" },
    email: { sk: "E-mail", en: "Email" },
    notes: { sk: "Chcete niečo doplniť?", en: "Anything we should know?" },
    notesHint: {
      sk: "Napríklad strach zo zubára, alergie alebo že prídete s dieťaťom.",
      en: "Nervous patient, allergies, or that you're coming with a child, for example.",
    },
    required: { sk: "Povinné pole", en: "Required" },
    invalidEmail: { sk: "Skontrolujte formát e-mailu", en: "Check the email format" },
    invalidPhone: { sk: "Skontrolujte telefónne číslo", en: "Check the phone number" },
    submit: { sk: "Odoslať žiadosť", en: "Send request" },

    successTitle: { sk: "Máme to!", en: "That's booked in!" },
    successLead: {
      sk: "Toto je ukážkový web, takže sa nikam nič neodoslalo. V ostrej verzii by vám teraz prišiel e-mail a ozvali by sme sa telefonicky.",
      en: "This is a demo site, so nothing was actually sent. On the live version you'd have an email by now, and a call to follow.",
    },
    summaryTitle: { sk: "Zhrnutie", en: "Summary" },
    bookAnother: { sk: "Objednať ďalší termín", en: "Book another visit" },
  },

  contact: {
    title: { sk: "Nájdete nás v Starom Meste", en: "Find us in the Old Town" },
    lead: {
      sk: "Zastavte sa, zavolajte alebo napíšte. Na e-maily odpovedáme v ten istý pracovný deň.",
      en: "Drop in, call, or write. We answer emails the same working day.",
    },
    hoursTitle: { sk: "Otváracie hodiny", en: "Opening hours" },
    addressTitle: { sk: "Adresa", en: "Address" },
    contactTitle: { sk: "Spojenie", en: "Get in touch" },
    mapNote: {
      sk: "Ukážková mapa — v ostrej verzii tu býva interaktívna mapa.",
      en: "Placeholder map — the live version carries an interactive one here.",
    },
    formTitle: { sk: "Napíšte nám", en: "Send us a message" },
    message: { sk: "Správa", en: "Message" },
    send: { sk: "Odoslať", en: "Send message" },
    sentTitle: { sk: "Správa je na ceste", en: "Message on its way" },
    sentLead: {
      sk: "Respektíve bola by — toto je ukážkový web bez servera. Nič sa neodoslalo ani neuložilo.",
      en: "It would be — this is a demo with no server behind it. Nothing was sent or stored.",
    },
    sendAnother: { sk: "Napísať znova", en: "Write another" },
  },

  footer: {
    blurb: {
      sk: "Rodinná zubná ambulancia v centre Bratislavy. Prevencia, detská stomatológia, estetika a implantáty.",
      en: "A family dental practice in central Bratislava. Prevention, kids' dentistry, cosmetic work and implants.",
    },
    navTitle: { sk: "Stránky", en: "Pages" },
    contactTitle: { sk: "Kontakt", en: "Contact" },
    hoursTitle: { sk: "Otvorené", en: "Open" },
    weekdays: { sk: "Po – Pi", en: "Mon – Fri" },
    saturday: { sk: "Sobota", en: "Saturday" },
    rights: { sk: "Ukážkový projekt", en: "Demo project" },
    builtBy: { sk: "Web navrhol a postavil", en: "Designed and built by" },
    backToStudio: { sk: "Späť na Ktenor", en: "Back to Ktenor" },
  },
} satisfies Record<string, unknown>;

/** Narrow helper so components can annotate props without importing the whole tree. */
export type Copy = typeof copy;
export type { Localized };
