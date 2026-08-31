function u(id: string) {
  return `https://images.unsplash.com/${id}?q=80&w=1200&auto=format&fit=crop`;
}

export const gallery = [
  { src: u("photo-1585747860715-2ba37e788b70"), alt: "Barber chair against exposed brick" },
  { src: u("photo-1599351431202-1e0f0137899a"), alt: "Straight razor detail work" },
  { src: u("photo-1675599193990-33d71150902b"), alt: "The shop floor, brick and wood" },
  { src: u("photo-1657105052497-f996284ffff8"), alt: "Thinning shears and comb work" },
  { src: u("photo-1672257493626-038f96997ade"), alt: "Chairs lined along the brick wall" },
  { src: u("photo-1593702275687-f8b402bf1fb5"), alt: "A cut in progress" },
  { src: u("photo-1621645582931-d1d3e6564943"), alt: "Chair and mirror station" },
  { src: u("photo-1599011176306-4a96f1516d4d"), alt: "Beard trim with scissors" },
];
