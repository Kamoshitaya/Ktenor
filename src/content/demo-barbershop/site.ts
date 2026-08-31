export const site = {
  name: "Forge & Blade",
  tagline: "Precision cuts, straight razor shaves, Bratislava.",
  address: "Karpatská 8, 811 05 Bratislava, Slovakia",
  /** E.164, used for tel: */
  phone: "+421907552190",
  phoneDisplay: "+421 907 552 190",
  instagram: "@forgeandblade.bratislava",
  instagramUrl: "https://instagram.com/forgeandblade.bratislava",
  mapEmbedSrc:
    "https://www.google.com/maps?q=Karpatsk%C3%A1%208%2C%20811%2005%20Bratislava&output=embed",
  hours: [
    { day: "Monday – Friday", time: "9:00 – 20:00" },
    { day: "Saturday", time: "9:00 – 18:00" },
    { day: "Sunday", time: "Closed" },
  ],
} as const;
