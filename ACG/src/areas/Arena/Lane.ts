interface GameState {
    currentTurn: number;
    maxTurns: number;
}

const gameState: GameState = {
    currentTurn: 0,
    maxTurns: 3,
};

export function updateTurnCounter(): void {
    gameState.currentTurn += 1;
    displayTurnCounter(); 
}

function displayTurnCounter(): void {
    const turnDisplay = document.getElementById('turnCounter');
    if (turnDisplay) {
        turnDisplay.textContent = `Turn ${gameState.currentTurn}/${gameState.maxTurns}`;
    } else {
        console.error('element not found');
    }
}


