import type ICard from "./ICard";

// Function: two cards are compared ("in combat with each other"), the winner is selected and send to the console.
//
export const cardCombat = (firstCard: ICard, secondCard: ICard): ICard | string => {
  const firstKillsSecond = firstCard.power >= secondCard.health;

  const secondKillsFirst = secondCard.power >= firstCard.health;

  const winningCard =
    firstKillsSecond && !secondKillsFirst
      ? firstCard
      : secondKillsFirst && !firstKillsSecond
      ? secondCard
      : !secondKillsFirst && !firstKillsSecond
      ? "Draw"
      : "Tie";

  return winningCard;
};
