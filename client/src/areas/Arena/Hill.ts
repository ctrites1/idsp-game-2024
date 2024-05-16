export function updateHillScores(): void {
	const oppHill = document.getElementById("oppHill");
	const playerHill = document.getElementById("playerHill");

	if (!oppHill || !playerHill) {
		console.error("Hill elements not found");
		return;
	}

	calculateAndDisplayScore(document.getElementById("oppTrench"), oppHill);
	calculateAndDisplayScore(document.getElementById("playerTrench"), playerHill);
}

function calculateAndDisplayScore(
	trench: HTMLElement | null,
	scoreDisplay: HTMLElement
): void {
	if (!trench) {
		console.error("Trench element not found");
		return;
	}

	const cardHolders = trench.querySelectorAll(".cardHolder");
	let totalScore = 0;

	cardHolders.forEach((cardHolder) => {
		const card = cardHolder.querySelector(".card");
		const score = parseInt(card?.getAttribute("data-power") || "0", 10);
		totalScore += score;
	});

	scoreDisplay.textContent = `${totalScore}`;
}

export function clearHillScores(): void {
	const oppHill = document.getElementById("oppHill") as HTMLElement;
	const playerHill = document.getElementById("playerHill") as HTMLElement;

	if (!oppHill || !playerHill) {
		console.error("Hill elements not found");
		return;
	}

	oppHill.textContent = "0";
	playerHill.textContent = "0";
}

export function playersScore() {
	const oppHill = document.getElementById("oppHill")
	const playerHill = document.getElementById("playerHill")
	const oppHillScore = parseInt(oppHill?.textContent as string);
	const playerHillScore = parseInt(playerHill?.textContent as string);
	const oppId = oppHill?.getAttribute("player-id")
	const playerId = playerHill?.getAttribute("player-id")
	//const scores = {opponentScore: {score: oppHillScore, playerId: oppId}, playerScore: { score: playerHillScore, playerId: playerId}};

	if (oppHillScore && playerHillScore){
		if(oppHillScore === playerHillScore) {
			return null
		} else if (oppHillScore > playerHillScore) {
			return oppId
		} else {
			return playerId
		}
	}
}
