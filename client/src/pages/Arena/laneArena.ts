

function displayTurnCounter(turn: number): void {
  const turnDisplay = document.querySelector(".turn-indicator");
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
  displayTurnCounter(playerCardsPlayed.length);
  console.log("pla", playerCardsPlayed.length);
  return oppCardsPlayed.length + playerCardsPlayed.length;
}
