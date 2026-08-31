export type Barber = {
  name: string;
  role: string;
  years: number;
  specialty: string;
  bio: string;
  photo: string;
};

function u(id: string) {
  return `https://images.unsplash.com/${id}?q=80&w=800&auto=format&fit=crop`;
}

export const team: Barber[] = [
  {
    name: "Viktor Krajčí",
    role: "Master Barber & Owner",
    years: 14,
    specialty: "Classic fades, straight razor shaves",
    bio: "Trained in Prague before opening Forge & Blade. Precision first, small talk optional — Viktor's chair is where regulars go when it has to be exact.",
    photo: u("photo-1560250097-0b93528c311a"),
  },
  {
    name: "Nikola Baránková",
    role: "Senior Barber",
    years: 9,
    specialty: "Beard sculpting, textured cuts",
    bio: "Nikola treats a beard line-up like architecture — every edge considered. Her textured crops are the most requested cut in the shop.",
    photo: u("photo-1581065178047-8ee15951ede6"),
  },
  {
    name: "Matej Horváth",
    role: "Barber",
    years: 6,
    specialty: "Skin fades, kids' first cuts",
    bio: "Fast hands, endless patience — Matej is who we book for nervous first-timers and kids who'd rather be anywhere else.",
    photo: u("photo-1616434116710-c45ce99c1a77"),
  },
  {
    name: "Samuel Novák",
    role: "Barber",
    years: 4,
    specialty: "Pompadours, hot towel shaves",
    bio: "Old-school technique with new-school energy. Samuel's hot towel shave has a waiting list of its own.",
    photo: u("photo-1676989880361-091e12efc056"),
  },
];
