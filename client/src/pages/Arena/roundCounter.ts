// let currentRound = 1; // Initialize current round

export function updateRoundIndicator(round: number) {
  // currentRound = round; // Update current round
  const roundIndicator = document.querySelector(".round-indicator");
  if (roundIndicator) {
    roundIndicator.textContent = `Round ${round}/3`;
  }
}

export function markRoundWinner(round: number, winnerId: number) {
  const playerRoundLog = document.querySelector(".player-round-log");
  const oppRoundLog = document.querySelector(".opp-round-log");
  const playerId = Number(
    document.querySelector("#playerHill")?.getAttribute("player-id")
  );

  if (winnerId === playerId) {
    // Update the player round log
    const playerRound = playerRoundLog?.querySelector(`.player-round-${round}`);
    console.log(`this is my round: ${round}`);
    playerRound?.classList.add("win");
  } else {
    // Update the opponent round log
    const oppRound = oppRoundLog?.querySelector(`.opp-round-${round}`);
    oppRound?.classList.add("win");
  }
}
