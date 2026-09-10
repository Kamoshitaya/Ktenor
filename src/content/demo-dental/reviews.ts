import type { Localized } from "./types";

export type Review = {
  id: string;
  name: string;
  /** Two initials stand in for a portrait — this is a demo, not real patients. */
  initials: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** Roughly when the visit happened, the way review sites show it. */
  when: Localized;
  quote: Localized;
};

export const reviews: Review[] = [
  {
    id: "andrea",
    name: "Andrea M.",
    initials: "AM",
    rating: 5,
    when: { sk: "pred 2 týždňami", en: "2 weeks ago" },
    quote: {
      sk: "Syn má päť rokov a doteraz sme každú návštevu u zubára odplakali. Tu si najprv len sadol a pozeral. Druhýkrát si nechal zapečatiť dve stoličky bez jediného protestu.",
      en: "My son is five and until now every dentist visit ended in tears. Here he just sat and watched the first time. On the second visit he had two molars sealed without a single protest.",
    },
  },
  {
    id: "jan",
    name: "Ján K.",
    initials: "JK",
    rating: 5,
    when: { sk: "pred mesiacom", en: "a month ago" },
    quote: {
      sk: "Prišiel som v piatok ráno s opuchnutou tvárou bez objednania. Vzali ma do hodiny, vysvetlili, čo sa deje, a v pondelok doriešili zvyšok. Cena sedela s tým, čo mi povedali dopredu.",
      en: "I turned up on a Friday morning with a swollen face and no appointment. They saw me within the hour, explained what was going on, and finished the rest on Monday. The price matched what they quoted up front.",
    },
  },
  {
    id: "silvia",
    name: "Silvia B.",
    initials: "SB",
    rating: 5,
    when: { sk: "pred 3 mesiacmi", en: "3 months ago" },
    quote: {
      sk: "Fazety na štyri predné zuby. Bála som sa, že to bude vidieť na kilometer, ale kolegovia si všimli len to, že akosi lepšie vyzerám. Presne o to mi šlo.",
      en: "Veneers on four front teeth. I was afraid they would be visible from a mile off, but all my colleagues noticed was that I somehow looked better. That was exactly the point.",
    },
  },
  {
    id: "peter",
    name: "Peter Ď.",
    initials: "PD",
    rating: 4,
    when: { sk: "pred 2 mesiacmi", en: "2 months ago" },
    quote: {
      sk: "Implantát prebehol úplne v poriadku a hojenie bez komplikácií. Jediné mínus — objednacia doba na chirurgiu bola tri týždne, čakal som kratšie.",
      en: "The implant went entirely smoothly and healed without complications. One minus — the wait for a surgery slot was three weeks, and I had hoped for sooner.",
    },
  },
  {
    id: "monika",
    name: "Monika T.",
    initials: "MT",
    rating: 5,
    when: { sk: "pred 5 mesiacmi", en: "5 months ago" },
    quote: {
      sk: "Chodíme sem všetci štyria vrátane dvojičiek. Termíny nám dajú za sebou v jedno popoludnie, takže z toho nie je celý týždeň behania.",
      en: "All four of us come here, twins included. They put our appointments back to back in one afternoon, so it does not turn into a week of running around.",
    },
  },
  {
    id: "robert",
    name: "Róbert H.",
    initials: "RH",
    rating: 5,
    when: { sk: "pred 6 mesiacmi", en: "6 months ago" },
    quote: {
      sk: "Desať rokov som k zubárovi nešiel zo strachu. Prvá návšteva bola len rozhovor, nič sa nevŕtalo. Odvtedy mám za sebou tri ošetrenia a je to v pohode.",
      en: "I avoided dentists for ten years out of fear. The first appointment was just a conversation — no drill, nothing. Three treatments later, it is genuinely fine.",
    },
  },
];

export const averageRating =
  Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10;
