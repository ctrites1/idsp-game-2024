// let currentRound = 1; // Initialize current round

export function updateRoundIndicator(round: number) {
  // currentRound = round; // Update current round
  const roundIndicator = document.querySelector(".round-indicator");
  if (roundIndicator) {
    roundIndicator.textContent = `Round ${round}/3`;
  }
}

export function markRoundWinner(data: any) {
  const playerRoundLog = document.querySelector(".player-round-log");
  const oppRoundLog = document.querySelector(".opp-round-log");
  const playerId1 = document.querySelector("#playerHill")?.getAttribute("player-id");
  const playerId = Number(playerId1)

  if (data.length > 0) {
    data.forEach((element: any) => {
      const { winner_id, roundswon } = element;

      if (winner_id !== null && roundswon > 0) {
        for (let round = 1; round <= roundswon; round++) {
          if (winner_id === playerId) {
            const playerRound = playerRoundLog?.querySelector(`.player-round-${round}`) as HTMLElement;
            if (playerRound) {
              playerRound.style.backgroundColor = "white";
              playerRound.classList.add("win");
              console.log(`Player won round: ${round}`);
            }
          } else {
            const oppRound = oppRoundLog?.querySelector(`.opp-round-${round}`) as HTMLElement;
            if (oppRound) {
              oppRound.style.backgroundColor = "white";
              oppRound.classList.add("win");
              console.log(`Opponent won round: ${round}`);
            }
          }
        }
      }
    });
  }
}
