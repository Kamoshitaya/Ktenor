export type MenuItem = {
  name: string;
  desc: string;
  price: string;
  photo: string;
};

function u(id: string) {
  return `https://images.unsplash.com/${id}?q=80&w=800&auto=format&fit=crop`;
}

export const menu: { category: string; items: MenuItem[] }[] = [
  {
    category: "Coffee",
    items: [
      { name: "Espresso", desc: "Single origin, pulled to order", price: "€2.60", photo: u("photo-1503240778100-fd245e17a273") },
      { name: "Double Espresso", desc: "Two shots, no compromise", price: "€3.20", photo: u("photo-1511426420268-4cfdd3763b77") },
      { name: "Americano", desc: "Espresso, hot water, quiet mornings", price: "€3.00", photo: u("photo-1593443320739-77f74939d0da") },
      { name: "Flat White", desc: "Double ristretto, microfoam", price: "€3.60", photo: u("photo-1650097364104-eef0e54af0da") },
      { name: "Cappuccino", desc: "Equal parts espresso, milk, foam", price: "€3.60", photo: u("photo-1563311977-d285756282dc") },
      { name: "Caffè Latte", desc: "Silky steamed milk, light crema", price: "€3.80", photo: u("photo-1742549626436-bf3c11dab212") },
      { name: "Cortado", desc: "Equal parts espresso and warm milk", price: "€3.40", photo: u("photo-1593543294918-ca3634e04cdb") },
      { name: "Mocha", desc: "Dark chocolate, espresso, cream", price: "€4.20", photo: u("photo-1545731939-9c302d5d27ed") },
      { name: "Oat Milk Latte", desc: "House oat milk, naturally sweet", price: "€4.00", photo: u("photo-1559001724-fbad036dbc9e") },
      { name: "Iced Latte", desc: "Slow-poured over ice", price: "€4.20", photo: u("photo-1690609561635-f63c587b3aba") },
      { name: "Pour-Over", desc: "Rotating single origin, brewed fresh", price: "€4.80", photo: u("photo-1507915135761-41a0a222c709") },
      { name: "Affogato", desc: "Vanilla bean gelato, hot espresso", price: "€5.20", photo: u("photo-1550731358-491ded4af838") },
    ],
  },
  {
    category: "Breakfast",
    items: [
      { name: "Avocado & Poached Egg Toast", desc: "Sourdough, chili oil, lemon", price: "€8.50", photo: u("photo-1574783756547-258b3c720fe9") },
      { name: "Full Oak Breakfast", desc: "Eggs, bacon, beans, grilled tomato, toast", price: "€11.90", photo: u("photo-1768634003098-9d5848d3b93f") },
      { name: "Shakshuka", desc: "Baked eggs, tomato, peppers, cumin", price: "€9.80", photo: u("photo-1524182732116-a3ad2034503c") },
      { name: "Smoked Salmon Bagel", desc: "Cream cheese, capers, dill", price: "€10.50", photo: u("photo-1667648236280-ed566d0d4d49") },
      { name: "Granola & Yoghurt Bowl", desc: "House granola, seasonal fruit, honey", price: "€7.20", photo: u("photo-1618666185561-baed3459ff18") },
      { name: "French Toast", desc: "Brioche, maple, roasted pecans", price: "€8.90", photo: u("photo-1525184782196-8e2ded604bf7") },
      { name: "Eggs Benedict", desc: "Poached eggs, ham, hollandaise", price: "€9.60", photo: u("photo-1710533788728-800be38530a8") },
      { name: "Mushroom & Thyme Omelette", desc: "Wild mushroom, thyme, gruyère", price: "€8.80", photo: u("photo-1620280614936-fbd4339f9446") },
      { name: "Overnight Oats", desc: "Oat milk, cinnamon, stewed fruit", price: "€6.50", photo: u("photo-1618666185697-b4aabeedd8bb") },
      { name: "Breakfast Burrito", desc: "Scrambled egg, chorizo, black beans", price: "€9.20", photo: u("photo-1734770205674-d117e4ba7926") },
      { name: "Sourdough & Whipped Ricotta", desc: "Wild honey, toasted walnut", price: "€7.80", photo: u("photo-1455853739633-8c94c03d8121") },
    ],
  },
  {
    category: "Desserts",
    items: [
      { name: "Dark Chocolate Ember Cake", desc: "House recipe, sea salt flake", price: "€5.50", photo: u("photo-1517427294546-5aa121f68e8a") },
      { name: "Classic Tiramisu", desc: "Espresso-soaked, mascarpone", price: "€5.80", photo: u("photo-1541779972238-2c60cd11ffc5") },
      { name: "Strawberry Shortcake", desc: "Vanilla sponge, fresh cream", price: "€5.60", photo: u("photo-1602663491496-73f07481dbea") },
      { name: "Basque Burnt Cheesecake", desc: "Caramelised top, soft centre", price: "€6.20", photo: u("photo-1713274783669-631543642a61") },
      { name: "Salted Caramel Tart", desc: "Shortcrust, Valrhona chocolate", price: "€5.90", photo: u("photo-1582716401301-b2407dc7563d") },
      { name: "Almond Croissant", desc: "Twice-baked, frangipane", price: "€3.80", photo: u("photo-1555507036-ab1f4038808a") },
      { name: "Cinnamon Roll", desc: "Brown butter glaze, warm", price: "€3.60", photo: u("photo-1651604033534-e66b281f1981") },
      { name: "Pistachio & Rose Cake", desc: "Ground pistachio, rosewater cream", price: "€6.40", photo: u("photo-1615735487485-e52b9af610c1") },
      { name: "Lemon Poppyseed Cake", desc: "Citrus glaze, poppyseed crumb", price: "€4.80", photo: u("photo-1536749605762-e7445a2d43ec") },
      { name: "Carrot Cake", desc: "Walnut, cream cheese frosting", price: "€5.20", photo: u("photo-1505804750389-62ac45da38b7") },
      { name: "Warm Apple Crumble", desc: "Oat crumble, vanilla custard", price: "€5.90", photo: u("photo-1708175313814-679cb8e90d2e") },
    ],
  },
];
