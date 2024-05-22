interface turnState {
  currentTurn: number;
  maxTurns: number;
}

const turnState: turnState = {
  currentTurn: 0,
  maxTurns: 3,
};

export function updateTurnCounter(): void {
  turnState.currentTurn += 1;
  displayTurnCounter();
}

function displayTurnCounter(): void {
  const turnDisplay = document.querySelector(".turn-indicator");
  if (turnDisplay) {
    turnDisplay.textContent = `Turn ${turnState.currentTurn}/${turnState.maxTurns}`;
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
  return oppCardsPlayed.length + playerCardsPlayed.length;
}
