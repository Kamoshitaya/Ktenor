export type ServiceItem = { name: string; desc: string; price: string; duration: string };

export const serviceGroups: { category: string; items: ServiceItem[] }[] = [
  {
    category: "Haircut",
    items: [
      { name: "Classic Haircut", desc: "Scissor or clipper, styled to finish", price: "€18", duration: "30 min" },
      { name: "Skin Fade", desc: "Zero-blend fade, razor-finished edges", price: "€22", duration: "40 min" },
      { name: "Textured Crop", desc: "Modern crop, matte or natural finish", price: "€20", duration: "35 min" },
      { name: "Buzz Cut", desc: "Single guard, clean and fast", price: "€14", duration: "20 min" },
      { name: "Master Barber Cut", desc: "With Viktor or Nikola — full consultation", price: "€28", duration: "45 min" },
    ],
  },
  {
    category: "Beard",
    items: [
      { name: "Beard Trim", desc: "Shape and tidy, clippers and scissors", price: "€12", duration: "15 min" },
      { name: "Beard Sculpt & Line-Up", desc: "Precision edges, defined cheek and neck lines", price: "€16", duration: "25 min" },
      { name: "Full Beard Restyle", desc: "Reshape from scratch, new silhouette", price: "€22", duration: "35 min" },
      { name: "Hot Towel Beard Treatment", desc: "Steamed towel, oil, conditioning balm", price: "€18", duration: "25 min" },
    ],
  },
  {
    category: "Shave",
    items: [
      { name: "Classic Straight Razor Shave", desc: "Hot towel, badger brush, single blade", price: "€24", duration: "40 min" },
      { name: "Head Shave", desc: "Full head, straight razor finish", price: "€20", duration: "30 min" },
      { name: "Shave & Beard Combo", desc: "Straight razor shave plus beard sculpt", price: "€32", duration: "55 min" },
    ],
  },
  {
    category: "Kids",
    items: [
      { name: "Kids Haircut (under 12)", desc: "Patient, quick, parent-approved", price: "€12", duration: "20 min" },
      { name: "Teen Cut (13–17)", desc: "Full style consultation included", price: "€16", duration: "30 min" },
    ],
  },
];
