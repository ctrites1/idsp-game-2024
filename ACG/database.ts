export interface Card {
  id: number;
  name: string;
  description: string;
  power: number;
  element: string;
  type: string;
}

export const cards: Card[] = [
  {
    id: 1,
    name: "Flame Dragon",
    description: "A fierce dragon that breathes fire.",
    power: 9,
    element: "Fire",
    type: "Unit",
  },
  {
    id: 2,
    name: "Ice Guardian",
    description: "A protective spirit of the icy realms.",
    power: 7,
    element: "Ice",
    type: "Unit",
  },
  {
    id: 3,
    name: "Water Sprite",
    description: "A playful sprite that controls water flows.",
    power: 4,
    element: "Water",
    type: "Unit",
  },
  {
    id: 4,
    name: "Volcano Eruptor",
    description: "A spell to summon volcanic eruptions.",
    power: 6,
    element: "Fire",
    type: "Spell",
  },
  {
    id: 5,
    name: "Frost Giant",
    description: "A giant from the frosty mountains.",
    power: 8,
    element: "Ice",
    type: "Unit",
  },
  {
    id: 6,
    name: "Aqua Shield",
    description: "A protective shield made of water.",
    power: 3,
    element: "Water",
    type: "Effect",
  },
  {
    id: 7,
    name: "Pyroclastic Flow",
    description: "A deadly flow of volcanic debris.",
    power: 9,
    element: "Fire",
    type: "Effect",
  },
  {id: 8, name: "Glacier Wall", description: "An impenetrable wall of ice.", power: 5, element: "Ice", type: "Effect"},
  {id: 9, name: "Hydro Blast", description: "A powerful blast of water.", power: 6, element: "Water", type: "Spell"},
  {
    id: 10,
    name: "Burning Phoenix",
    description: "A mythical bird reborn from flames.",
    power: 9,
    element: "Fire",
    type: "Unit",
  },
  {
    id: 11,
    name: "Ice Sorcerer",
    description: "A sorcerer who wields the power of ice.",
    power: 7,
    element: "Ice",
    type: "Unit",
  },
  {
    id: 12,
    name: "River Spirit",
    description: "A spirit that commands the river currents.",
    power: 5,
    element: "Water",
    type: "Unit",
  },
];
