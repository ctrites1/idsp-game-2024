import { cardCombat } from "./cardCombat";
import { Cards } from "./fake_card_db";
import { test, expect } from "bun:test";

/* test("return powers of both cards", () => {
  expect(cardCombat(Cards.card1, Cards.card2)).toEqual({
    firstAtk: 10,
    secondAtk: 5,
  });
}); */

/* test("return power and health of both cards", () => {
  expect(cardCombat(Cards.card1, Cards.card2)).toEqual({
    firstHP: 9,
    firstAtk: 10,
    secondHP: 5,
    secondAtk: 10,
  });
}); */

/* test("return card that has higher health", () => {
  expect(cardCombat(Cards.card1, Cards.card2)).toEqual(Cards.card2);
}); */

/* test("return card with higher power", () => {
  expect(cardCombat(Cards.card1, Cards.card2)).toEqual(Cards.card1);
}); */

test("return a tie if the both cards 'die' ", () => {
  expect(cardCombat(Cards.card1, Cards.card3)).toBe("Tie");
});

test("return a draw if the both cards 'survive' ", () => {
  expect(cardCombat(Cards.card3, Cards.card4)).toBe("Draw");
});

test("return card that will win if cards attack each other", () => {
  expect(cardCombat(Cards.card1, Cards.card2)).toEqual(Cards.card1);
  expect(cardCombat(Cards.card3, Cards.card2)).toEqual(Cards.card3);
});
