import type { CategoryId } from "./services";
import type { Localized } from "./types";

/**
 * The 3D arch is a scanned mandible split into sixteen crowns plus the gum
 * (see scripts/jaw). Every crown is pickable; these three entries mark the
 * ones that carry a caption and a link into the treatment list.
 *
 * Indices run along the arch, so 0 is the back right third molar, 7 and 8 are
 * the two central incisors, and 15 is the back left third molar.
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
    index: 0,
    label: { sk: "Zub múdrosti", en: "Wisdom tooth" },
    note: {
      sk: "Tlačí, nezmestí sa alebo sa zapaľuje ďasno okolo neho.",
      en: "Pressing, short of room, or the gum around it keeps flaring up.",
    },
    treatmentId: "surgical-extraction",
    category: "emergency",
  },
  {
    index: 2,
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
