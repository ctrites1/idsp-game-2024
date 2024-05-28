export function updateRoundIndicator(round: number) {
  const roundIndicator = document.querySelector(".round-indicator");
  if (roundIndicator) {
    roundIndicator.textContent = `Round ${round}/3`;
  }
}

export function markRoundWinner(round: number, winnerId: number) {
  const playerId = 1; // You should replace this with the actual playerId
  const roundLogClass = winnerId === playerId ? ".player-round-log" : ".opp-round-log";
  const roundElement = document.querySelector(`${roundLogClass} .round-${round}`);
  
  if (roundElement) {
    roundElement.classList.add("round-winner");
  }
}
