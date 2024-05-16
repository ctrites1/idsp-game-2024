export function updateRoundIndicator(roundId: number) {
  const roundIndicator = document.querySelector(".round-indicator");
  if (roundIndicator) {
    roundIndicator.textContent = `Round ${roundId}/3`;
  }
}
