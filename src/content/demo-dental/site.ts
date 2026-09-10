import type { Localized } from "./types";

/**
 * Root & Bloom Family Dental — a fictional Bratislava clinic invented for this
 * demo. Address, numbers and handles are made up; they are written to read as
 * real so the build shows what finished content looks like, not placeholder text.
 */
export const clinic = {
  name: "Root & Bloom",
  fullName: "Root & Bloom Family Dental",
  tagline: {
    sk: "Zubná starostlivosť, na ktorú sa deti tešia",
    en: "Dental care the whole family looks forward to",
  } satisfies Localized,

  address: {
    street: "Kozia 18",
    city: "Bratislava",
    postal: "811 03",
    district: {
      sk: "Staré Mesto",
      en: "Staré Mesto (Old Town)",
    } satisfies Localized,
  },

  phone: "+421 2 5443 8890",
  phoneHref: "tel:+421254438890",
  email: "ahoj@rootandbloom.sk",
  instagram: "@rootandbloom.sk",
  instagramUrl: "https://instagram.com/rootandbloom.sk",

  /** Public transport note — the kind of detail a real clinic page carries. */
  transport: {
    sk: "Dve minúty pešo od zastávky Zochova, parkovanie na Palisádach.",
    en: "Two minutes from the Zochova tram stop, parking on Palisády.",
  } satisfies Localized,
} as const;

export type OpeningHour = {
  day: Localized;
  hours: Localized;
  /** Saturday runs a short morning; Sunday is closed. */
  isClosed?: boolean;
};

export const openingHours: OpeningHour[] = [
  {
    day: { sk: "Pondelok", en: "Monday" },
    hours: { sk: "8:00 – 18:00", en: "8:00 – 18:00" },
  },
  {
    day: { sk: "Utorok", en: "Tuesday" },
    hours: { sk: "8:00 – 18:00", en: "8:00 – 18:00" },
  },
  {
    day: { sk: "Streda", en: "Wednesday" },
    hours: { sk: "8:00 – 19:00", en: "8:00 – 19:00" },
  },
  {
    day: { sk: "Štvrtok", en: "Thursday" },
    hours: { sk: "8:00 – 18:00", en: "8:00 – 18:00" },
  },
  {
    day: { sk: "Piatok", en: "Friday" },
    hours: { sk: "8:00 – 15:00", en: "8:00 – 15:00" },
  },
  {
    day: { sk: "Sobota", en: "Saturday" },
    hours: { sk: "9:00 – 13:00", en: "9:00 – 13:00" },
  },
  {
    day: { sk: "Nedeľa", en: "Sunday" },
    hours: { sk: "Zatvorené", en: "Closed" },
    isClosed: true,
  },
];
