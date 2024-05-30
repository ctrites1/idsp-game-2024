export function updateRoundIndicator(round: number) {
  const roundIndicator = document.querySelector(".round-indicator");
  if (roundIndicator) {
    roundIndicator.textContent = `Round ${round}/3`;
  }
}

function markRoundWinner(round: number, winner: "player" | "opp") {
  const playerRound = document.querySelector(`.player-round-${round}`);
  const oppRound = document.querySelector(`.opp-round-${round}`);
  
  if (winner === "player" && playerRound) {
    playerRound.classList.add("winner");
  } else if (winner === "opp" && oppRound) {
    oppRound.classList.add("winner");
  }
}

