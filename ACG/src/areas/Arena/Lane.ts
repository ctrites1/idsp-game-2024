import { clearTrench } from "./Trench";

let totalTurns: number = 0;

interface turnState {
    currentTurn: number;
    maxTurns: number;
    currentRound: number;
}

const turnState: turnState = {
    currentTurn: 1,
    maxTurns: 10,
    currentRound: 0,
};

export function updateTurnCounter(): void {
    totalTurns += 1;

    if (totalTurns % 6 === 0) {
        turnState.currentRound += 1; 
        turnState.currentTurn += 1;

        totalTurns = 0;

        clearTrench();
    } else {
        turnState.currentTurn += 1;
    }
    displayTurnCounter();
}

function displayTurnCounter(): void {
    const turnDisplay = document.querySelector('.turn-indicator');
    if (turnDisplay) {
        turnDisplay.textContent = `Round ${turnState.currentTurn}/${turnState.maxTurns}`;
    } else {
        console.error('element not found');
    }
}

interface GameState {
    currentPlayerId: number;
    yourPlayerId: number;
}

const gameState: GameState = {
    currentPlayerId: 1,
    yourPlayerId: 1  
};

function updateEndTurnButton(): void {
    const endTurnButton = document.querySelector('.endTurn-button') as HTMLButtonElement;
    if (!endTurnButton) {
        console.error('End Turn button not found');
        return;
    }
    endTurnButton.disabled = gameState.currentPlayerId !== gameState.yourPlayerId;
}

function changeTurn(): void {
    gameState.currentPlayerId = gameState.currentPlayerId === 1 ? 2 : 1;
    updateEndTurnButton();
}

function receiveGameStateUpdate(newGameState?: GameState): void {
    if (newGameState) {
        gameState.currentPlayerId = newGameState.currentPlayerId;
    }
    updateEndTurnButton();
}

function handleEndTurnClick(): void {
    console.log("End Turn clicked");
    changeTurn();
}

document.addEventListener('DOMContentLoaded', () => {
    const endTurnButton = document.querySelector('.endTurn-button');
    if (endTurnButton) {
        endTurnButton.addEventListener('click', handleEndTurnClick);
    } else {
        console.error('End Turn button not found on page load');
    }

    receiveGameStateUpdate({ currentPlayerId: 1, yourPlayerId: 1 });
});


