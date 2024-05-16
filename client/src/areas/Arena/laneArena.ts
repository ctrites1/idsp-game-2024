interface turnState {
	currentTurn: number;
	maxTurns: number;
}

const turnState: turnState = {
	currentTurn: 1,
	maxTurns: 10,
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
