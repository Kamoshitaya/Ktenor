import type { CategoryId } from "./services";
import type { Localized } from "./types";

export type Doctor = {
  id: string;
  /** Slovak dental titles: MUDr. is the older medical route, MDDr. the newer dental one. */
  name: string;
  role: Localized;
  /** Which treatment categories this person takes, used to filter the booking step. */
  categories: CategoryId[];
  yearsExperience: number;
  bio: Localized;
  languages: Localized[];
  /** Two initials for the placeholder portrait — no invented photos of real-looking people. */
  initials: string;
};

const SK = { sk: "slovenčina", en: "Slovak" } satisfies Localized;
const EN = { sk: "angličtina", en: "English" } satisfies Localized;
const HU = { sk: "maďarčina", en: "Hungarian" } satisfies Localized;
const DE = { sk: "nemčina", en: "German" } satisfies Localized;
const CZ = { sk: "čeština", en: "Czech" } satisfies Localized;

export const doctors: Doctor[] = [
  {
    id: "hruskova",
    name: "MUDr. Zuzana Hrušková",
    initials: "ZH",
    role: { sk: "Vedúca lekárka, rodinná stomatológia", en: "Lead dentist, family dentistry" },
    categories: ["preventive", "restorative", "emergency"],
    yearsExperience: 17,
    bio: {
      sk: "Root & Bloom otvorila v roku 2016 s jednoduchým zámerom: aby celá rodina chodila k jednému lekárovi a nikto sa nebál. Vedie prevenciu a bežnú rekonštrukciu, a ak sa dieťa bojí, väčšinou si sadne k nej.",
      en: "She opened Root & Bloom in 2016 with one idea: the whole family seeing one dentist, and nobody dreading it. She runs preventive and everyday restorative care, and when a child is nervous, they usually end up in her chair.",
    },
    languages: [SK, EN, CZ],
  },
  {
    id: "kollar",
    name: "MUDr. Marek Kollár",
    initials: "MK",
    role: { sk: "Implantológia a dentoalveolárna chirurgia", en: "Implantology & oral surgery" },
    categories: ["restorative", "emergency"],
    yearsExperience: 13,
    bio: {
      sk: "Venuje sa implantátom a chirurgii vrátane zložitých osmičiek. Pred každým zákrokom si vyhradí čas na to, aby pacient presne vedel, čo sa bude diať a ako dlho to potrvá.",
      en: "He handles implants and surgery, including the awkward wisdom teeth. Before anything starts he takes the time to walk the patient through exactly what will happen and how long it takes.",
    },
    languages: [SK, EN, DE],
  },
  {
    id: "bartosova",
    name: "MDDr. Lucia Bartošová",
    initials: "LB",
    role: { sk: "Detská stomatológia", en: "Paediatric dentistry" },
    categories: ["kids", "preventive"],
    yearsExperience: 9,
    bio: {
      sk: "Špecializuje sa na deti od prvého zúbka. Prvá návšteva u nej býva bez ošetrenia — dieťa si obzrie kreslo, zrkadielko aj odsávačku a odchádza s tým, že tu bolo fajn.",
      en: "She works with children from their very first tooth. A first visit with her usually involves no treatment at all — the child inspects the chair, the mirror and the suction, and leaves thinking it went fine.",
    },
    languages: [SK, EN, HU],
  },
  {
    id: "nagy",
    name: "MUDr. Tamás Nagy",
    initials: "TN",
    role: { sk: "Estetická stomatológia a protetika", en: "Cosmetic dentistry & prosthetics" },
    categories: ["cosmetic", "restorative"],
    yearsExperience: 15,
    bio: {
      sk: "Robí fazety, korunky a bielenie. Drží sa zásady, že najlepšia estetická práca je tá, ktorú nikto nerozozná od vlastných zubov — vrátane pacienta po pár týždňoch.",
      en: "Veneers, crowns and whitening are his day. He works to one rule: the best cosmetic dentistry is the kind nobody can pick out from real teeth — including the patient, a few weeks later.",
    },
    languages: [SK, HU, EN],
  },
  {
    id: "vargova",
    name: "Bc. Petra Vargová",
    initials: "PV",
    role: { sk: "Dentálna hygienička", en: "Dental hygienist" },
    categories: ["preventive", "kids"],
    yearsExperience: 7,
    bio: {
      sk: "Vedie dentálnu hygienu a liečbu ďasien. Namiesto výčitiek ukáže, ktoré dve miesta si väčšina ľudí čistí zle, a ako to zmeniť za tridsať sekúnd denne.",
      en: "She runs hygiene appointments and gum treatment. Instead of a telling-off, you get a demonstration of the two spots most people miss — and how to fix it in thirty seconds a day.",
    },
    languages: [SK, EN, CZ],
  },
];

export function doctorsForCategory(category: CategoryId | null): Doctor[] {
  if (!category) return doctors;
  return doctors.filter((doctor) => doctor.categories.includes(category));
}
