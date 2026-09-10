import type { CategoryId } from "./services";
import type { Localized } from "./types";

/**
 * The 3D arch is generated from maths rather than a modelled asset — sixteen
 * teeth placed around an ellipse, so there is no mesh to download. These
 * entries mark the three that are interactive and say what they link to.
 */
export type ToothHotspot = {
  /** Index along the arch, 0 = patient's back right, 15 = back left. */
  index: number;
  label: Localized;
  /** Why someone taps this tooth — the tooltip body. */
  note: Localized;
  treatmentId: string;
  category: CategoryId;
};

export const hotspots: ToothHotspot[] = [
  {
    index: 1,
    label: { sk: "Zub múdrosti", en: "Wisdom tooth" },
    note: {
      sk: "Tlačí, nezmestí sa alebo sa zapaľuje ďasno okolo neho.",
      en: "Pressing, short of room, or the gum around it keeps flaring up.",
    },
    treatmentId: "surgical-extraction",
    category: "emergency",
  },
  {
    index: 4,
    label: { sk: "Stolička", en: "Molar" },
    note: {
      sk: "Najčastejšie miesto kazu. Bolesť na sladké alebo studené patrí sem.",
      en: "The most common place for decay. Pain on sweet or cold things starts here.",
    },
    treatmentId: "filling",
    category: "restorative",
  },
  {
    index: 8,
    label: { sk: "Predný zub", en: "Front tooth" },
    note: {
      sk: "Odštiepnutý roh, medzera alebo odtieň, ktorý vám na fotkách prekáža.",
      en: "A chipped corner, a gap, or a shade that bothers you in photographs.",
    },
    treatmentId: "veneer",
    category: "cosmetic",
  },
];

export const TOOTH_COUNT = 16;
