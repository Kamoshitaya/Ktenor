import type { Localized } from "./types";

export const categoryIds = [
  "preventive",
  "kids",
  "cosmetic",
  "restorative",
  "emergency",
] as const;

export type CategoryId = (typeof categoryIds)[number];

export type Category = {
  id: CategoryId;
  name: Localized;
  blurb: Localized;
};

export const categories: Category[] = [
  {
    id: "preventive",
    name: { sk: "Prevencia a rodinná starostlivosť", en: "Preventive & Family Care" },
    blurb: {
      sk: "Pravidelné prehliadky a hygiena, ktoré väčšine problémov predídu skôr, než začnú bolieť.",
      en: "Regular check-ups and hygiene that head most problems off long before they start to hurt.",
    },
  },
  {
    id: "kids",
    name: { sk: "Detská stomatológia", en: "Kids Dentistry" },
    blurb: {
      sk: "Prvé návštevy bez sĺz. Deťom necháme čas si všetko obzrieť a osahať.",
      en: "First visits without tears. Children get time to look at everything and touch it first.",
    },
  },
  {
    id: "cosmetic",
    name: { sk: "Estetická stomatológia", en: "Cosmetic Dentistry" },
    blurb: {
      sk: "Jemné zásahy, po ktorých úsmev vyzerá lepšie, ale stále ako váš vlastný.",
      en: "Gentle work that leaves your smile looking better — and still like your own.",
    },
  },
  {
    id: "restorative",
    name: { sk: "Rekonštrukcia a implantáty", en: "Restorative & Implants" },
    blurb: {
      sk: "Keď zub treba opraviť alebo nahradiť, aby ste znova normálne jedli a hovorili.",
      en: "When a tooth needs repairing or replacing, so you can eat and speak normally again.",
    },
  },
  {
    id: "emergency",
    name: { sk: "Akútne ošetrenie", en: "Emergency Care" },
    blurb: {
      sk: "Bolesť neplánuje. Každý deň držíme voľné miesta pre akútne prípady.",
      en: "Pain does not book ahead. We hold slots open for urgent cases every day.",
    },
  },
];

export type Treatment = {
  id: string;
  category: CategoryId;
  name: Localized;
  description: Localized;
  /** € range as shown on the price list; the calculator uses priceFrom. */
  priceFrom: number;
  priceTo: number;
  /** Priced per tooth, so the calculator multiplies it by the tooth count. */
  perTooth?: boolean;
};

export const treatments: Treatment[] = [
  /* --- Preventive & family care ---------------------------------------- */
  {
    id: "checkup",
    category: "preventive",
    name: { sk: "Vstupná prehliadka", en: "Check-up & consultation" },
    description: {
      sk: "Prejdeme celý chrup, vysvetlíme nálezy a spolu určíme, čo je naozaj potrebné.",
      en: "We go through the whole mouth, explain what we find and agree what actually needs doing.",
    },
    priceFrom: 25,
    priceTo: 40,
  },
  {
    id: "hygiene",
    category: "preventive",
    name: { sk: "Dentálna hygiena", en: "Dental hygiene" },
    description: {
      sk: "Odstránenie zubného kameňa a pigmentácií, air-flow a nácvik techniky čistenia.",
      en: "Scaling, stain removal, air-flow polishing and a run-through of your brushing technique.",
    },
    priceFrom: 55,
    priceTo: 85,
  },
  {
    id: "xray-small",
    category: "preventive",
    name: { sk: "Intraorálny RTG snímok", en: "Intraoral X-ray" },
    description: {
      sk: "Cielený snímok jedného zuba, keď treba vidieť, čo sa deje pod povrchom.",
      en: "A single-tooth image for when we need to see what is happening below the surface.",
    },
    priceFrom: 12,
    priceTo: 20,
  },
  {
    id: "xray-opg",
    category: "preventive",
    name: { sk: "Panoramatický snímok (OPG)", en: "Panoramic X-ray (OPG)" },
    description: {
      sk: "Prehľad celej čeľuste naraz — základ pred implantátmi aj pri plánovaní liečby.",
      en: "The whole jaw in one image — the starting point for implants and treatment planning.",
    },
    priceFrom: 30,
    priceTo: 50,
  },
  {
    id: "perio",
    category: "preventive",
    name: { sk: "Liečba parodontu", en: "Gum (periodontal) treatment" },
    description: {
      sk: "Hĺbkové čistenie pod ďasnami pri krvácaní alebo ustupujúcich ďasnách.",
      en: "Deep cleaning below the gum line for bleeding or receding gums.",
    },
    priceFrom: 90,
    priceTo: 220,
  },
  {
    id: "nightguard",
    category: "preventive",
    name: { sk: "Nočná dlaha proti bruxizmu", en: "Night guard for grinding" },
    description: {
      sk: "Dlaha na mieru, ktorá ochráni zuby, ak v noci zatínate alebo škrípete.",
      en: "A custom guard that protects your teeth if you clench or grind at night.",
    },
    priceFrom: 160,
    priceTo: 260,
  },

  /* --- Kids -------------------------------------------------------------- */
  {
    id: "kids-first",
    category: "kids",
    name: { sk: "Prvá návšteva dieťaťa", en: "Child's first visit" },
    description: {
      sk: "Zoznámenie s ordináciou bez ošetrenia. Dieťa si sadne do kresla, len ak chce.",
      en: "Getting to know the surgery, with no treatment. Your child sits in the chair only if they want to.",
    },
    priceFrom: 20,
    priceTo: 35,
  },
  {
    id: "kids-checkup",
    category: "kids",
    name: { sk: "Detská preventívna prehliadka", en: "Children's check-up" },
    description: {
      sk: "Kontrola mliečnych aj stálych zubov a sledovanie, ako sa chrup vyvíja.",
      en: "A look at baby and adult teeth together, tracking how the bite is developing.",
    },
    priceFrom: 22,
    priceTo: 35,
  },
  {
    id: "sealant",
    category: "kids",
    name: { sk: "Pečatenie ryhy", en: "Fissure sealant" },
    description: {
      sk: "Tenká ochranná vrstva do ryhy stoličky — najjednoduchšia prevencia kazu.",
      en: "A thin protective layer in the groove of a molar — the simplest cavity prevention there is.",
    },
    priceFrom: 25,
    priceTo: 45,
    perTooth: true,
  },
  {
    id: "fluoride",
    category: "kids",
    name: { sk: "Fluoridácia", en: "Fluoride treatment" },
    description: {
      sk: "Rýchle ošetrenie, ktoré posilní sklovinu. Deti ho zvládnu za pár minút.",
      en: "A quick treatment that strengthens enamel. Children are through it in a few minutes.",
    },
    priceFrom: 25,
    priceTo: 40,
  },
  {
    id: "kids-filling",
    category: "kids",
    name: { sk: "Výplň mliečneho zuba", en: "Filling on a baby tooth" },
    description: {
      sk: "Ošetrenie kazu na mliečnom zube, aby vydržal až do prirodzenej výmeny.",
      en: "Treating decay on a baby tooth so it lasts until it is due to come out on its own.",
    },
    priceFrom: 45,
    priceTo: 90,
    perTooth: true,
  },

  /* --- Cosmetic ---------------------------------------------------------- */
  {
    id: "whitening",
    category: "cosmetic",
    name: { sk: "Bielenie v ordinácii", en: "In-office whitening" },
    description: {
      sk: "Jedno sedenie, viditeľný rozdiel. Odtieň volíme tak, aby pôsobil prirodzene.",
      en: "One session, a visible difference. We pick a shade that still reads as natural.",
    },
    priceFrom: 260,
    priceTo: 390,
  },
  {
    id: "whitening-home",
    category: "cosmetic",
    name: { sk: "Domáce bielenie so šablónami", en: "Take-home whitening kit" },
    description: {
      sk: "Šablóny na mieru a gél na dva týždne. Pomalšie, jemnejšie k sklovine.",
      en: "Custom trays and two weeks of gel. Slower, and gentler on the enamel.",
    },
    priceFrom: 170,
    priceTo: 240,
  },
  {
    id: "veneer",
    category: "cosmetic",
    name: { sk: "Keramická fazeta", en: "Porcelain veneer" },
    description: {
      sk: "Tenká keramická vrstva na prednú plochu zuba — tvar aj odtieň na mieru.",
      en: "A thin ceramic layer on the front of the tooth, shaped and shaded to match.",
    },
    priceFrom: 420,
    priceTo: 700,
    perTooth: true,
  },
  {
    id: "bonding",
    category: "cosmetic",
    name: { sk: "Estetická dostavba", en: "Composite bonding" },
    description: {
      sk: "Doplnenie odštiepnutého rohu alebo úprava tvaru počas jednej návštevy.",
      en: "Rebuilding a chipped corner or reshaping a tooth, in a single visit.",
    },
    priceFrom: 110,
    priceTo: 220,
    perTooth: true,
  },

  /* --- Restorative & implants -------------------------------------------- */
  {
    id: "filling",
    category: "restorative",
    name: { sk: "Biela výplň", en: "Composite filling" },
    description: {
      sk: "Kompozitná výplň vo farbe zuba. Bežné ošetrenie kazu na jednu návštevu.",
      en: "A tooth-coloured composite filling — routine cavity treatment in one appointment.",
    },
    priceFrom: 65,
    priceTo: 130,
    perTooth: true,
  },
  {
    id: "endo",
    category: "restorative",
    name: { sk: "Endodoncia (koreňový kanálik)", en: "Root canal treatment" },
    description: {
      sk: "Ošetrenie zapáleného nervu pod mikroskopom. Cena závisí od počtu kanálikov.",
      en: "Treating an inflamed nerve under the microscope. Price depends on the number of canals.",
    },
    priceFrom: 180,
    priceTo: 380,
    perTooth: true,
  },
  {
    id: "crown",
    category: "restorative",
    name: { sk: "Zirkónová korunka", en: "Zirconia crown" },
    description: {
      sk: "Celokeramická korunka na výrazne poškodený zub. Pevná a bez kovového okraja.",
      en: "An all-ceramic crown for a badly damaged tooth. Strong, with no metal edge.",
    },
    priceFrom: 380,
    priceTo: 620,
    perTooth: true,
  },
  {
    id: "implant",
    category: "restorative",
    name: { sk: "Zubný implantát", en: "Dental implant" },
    description: {
      sk: "Titánový implantát vrátane abutmentu a korunky. Riešenie na desaťročia.",
      en: "A titanium implant including abutment and crown — a solution measured in decades.",
    },
    priceFrom: 950,
    priceTo: 1600,
    perTooth: true,
  },
  {
    id: "bridge",
    category: "restorative",
    name: { sk: "Trojčlenný mostík", en: "Three-unit bridge" },
    description: {
      sk: "Nahradí chýbajúci zub opretím o dva susedné. Alternatíva k implantátu.",
      en: "Replaces a missing tooth by resting on the two beside it — the alternative to an implant.",
    },
    priceFrom: 900,
    priceTo: 1500,
  },
  {
    id: "denture",
    category: "restorative",
    name: { sk: "Snímateľná náhrada", en: "Removable denture" },
    description: {
      sk: "Čiastočná alebo celková náhrada zhotovená na mieru vo vlastnom laboratóriu.",
      en: "A partial or full denture, made to measure in our own laboratory.",
    },
    priceFrom: 520,
    priceTo: 980,
  },

  /* --- Emergency --------------------------------------------------------- */
  {
    id: "emergency-visit",
    category: "emergency",
    name: { sk: "Akútne ošetrenie bolesti", en: "Emergency pain visit" },
    description: {
      sk: "Prídete dnes, bolesť utíšime dnes. Ďalší postup doriešime, keď sa vám uľaví.",
      en: "Come in today and we settle the pain today. What comes next we plan once you are comfortable.",
    },
    priceFrom: 70,
    priceTo: 130,
  },
  {
    id: "extraction",
    category: "emergency",
    name: { sk: "Extrakcia zuba", en: "Tooth extraction" },
    description: {
      sk: "Bežné vytrhnutie zuba, ktorý sa už zachrániť nedá, v lokálnej anestézii.",
      en: "A straightforward extraction of a tooth that cannot be saved, under local anaesthetic.",
    },
    priceFrom: 55,
    priceTo: 110,
    perTooth: true,
  },
  {
    id: "surgical-extraction",
    category: "emergency",
    name: { sk: "Chirurgická extrakcia (osmičky)", en: "Surgical extraction (wisdom tooth)" },
    description: {
      sk: "Zložitejšie vybratie zadržaného zuba múdrosti vrátane kontroly hojenia.",
      en: "The more involved removal of an impacted wisdom tooth, follow-up check included.",
    },
    priceFrom: 140,
    priceTo: 280,
    perTooth: true,
  },
];

export function treatmentsByCategory(category: CategoryId): Treatment[] {
  return treatments.filter((treatment) => treatment.category === category);
}
