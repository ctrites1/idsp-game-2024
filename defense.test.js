const defendAttack = require("./defense");

const cards = [
  {
    name: "Water Support 6",
    element: "Water",
    power: 5,
    cardClass: "Support",
    effects: "Shield",
  },
  {
    name: "Ice Hero 7",
    element: "Ice",
    power: 1,
    cardClass: "Hero",
    effects: "Mass Heal",
  },
  {
    name: "Earth Melee 8",
    element: "Earth",
    power: 3,
    cardClass: "Melee",
    effects: "Double Hit",
  },
  {
    name: "Wind Mage 9",
    element: "Wind",
    power: 6,
    cardClass: "Mage",
    effects: "Burn",
  },
  {
    name: "Fire Support 10",
    element: "Fire",
    power: 1,
    cardClass: "Support",
    effects: "Revive",
  },
  {
    name: "Water Hero 11",
    element: "Water",
    power: 4,
    cardClass: "Hero",
    effects: "Ultimate Strike",
  },
  {
    name: "Ice Melee 12",
    element: "Ice",
    power: 5,
    cardClass: "Melee",
    effects: "Strike",
  },
  {
    name: "Earth Mage 13",
    element: "Earth",
    power: 2,
    cardClass: "Mage",
    effects: "Shock",
  },
];

// Wind Mage 9 attack against Water support
test("attack power - defense power", () => {
  expect(defendAttack(cards[3], cards[0])).toBe(1);
});

// Trying to attack with defense card
test("attacking with defense card, no attack happens", () => {
  expect(defendAttack(cards[0], cards[1])).toBe(null);
});

//Trying to defend with attack card
test("defending with attack card, no defense points awarded", () => {
  expect(defendAttack(cards[2], cards[3])).toBe(cards[2].power);
});

//Attack cannot have negative value
test("defense power is higher than attack power, attack happens but with 0 effect", () => {
  expect(defendAttack(cards[2], cards[0])).toBe(0);
});

//
