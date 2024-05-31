function displayTurnCounter(turn: number): void {
  const turnDisplay = document.querySelector(".turn-indicator");
  if (turn > 3) {
    turn = 3;
  }
  if (turn < 1) {
    turn = 1;
  }
  if (turnDisplay) {
    turnDisplay.textContent = `Turn ${turn}/3`;
  } else {
    console.error("element not found");
  }
}

export function countCards() {
  const oppTrench = document.querySelector("#oppTrench") as HTMLDivElement;
  const playerTrench = document.querySelector(
    "#playerTrench"
  ) as HTMLDivElement;
  const oppCards = Array.from(oppTrench?.querySelectorAll(".cardHolder"));
  const playerCards = Array.from(playerTrench?.querySelectorAll(".cardHolder"));
  const oppCardsPlayed = oppCards.filter((card) => card.hasChildNodes());
  const playerCardsPlayed = playerCards.filter((card) => card.hasChildNodes());
  displayTurnCounter(playerCardsPlayed.length + 1);
  return oppCardsPlayed.length + playerCardsPlayed.length;
}
