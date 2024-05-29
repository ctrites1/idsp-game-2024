import { createCard, dragstartHandler, moveCardToTrench } from "./cardArena";
import { addCardToOppTrench } from "./trenchArena";
import { updateRoundIndicator } from "./roundCounter";
import { updateTurnCounter } from "./laneArena";

export async function startgame(playerId: number, oppId: number) {
  const game = await fetch("/api/startgame", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      playerId,
      oppId,
    }),
  });
  // can get player id and opponent to set attribute for hills
  const response = await game.json();
  if (response) {
    const cg = await currentgame(playerId, oppId);
    await setupGameState(cg, playerId, oppId);
    return cg;
  }
}

export async function currentgame(playerId: number, oppId: number) {
  const game = await fetch("/api/currentgame", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      playerId,
      oppId,
    }),
  });
  const response = await game.json();
  return response;
}

async function setupGameState(gameState: any, playerId: number, oppId: number) {
  updateRoundIndicator(gameState.round);
  updateTurnCounter();
  let roundId = gameState.round_id;
  if (gameState.data) {
    roundId = gameState.data.round_id;
    gameState.data.oppMoves.map((m: any) => {
      const oppCard = createCard(m);
      oppCard.removeEventListener("dragstart", dragstartHandler);
      oppCard.draggable = false;
      addCardToOppTrench(oppCard);
    });
    gameState.data.playersMoves.map((m: any) => {
      const playerCard = createCard(m);
      playerCard.removeEventListener("dragstart", dragstartHandler);
      playerCard.draggable = false;
      moveCardToTrench(playerCard);
    });
  }
  const oppHill = document.getElementById("oppHill");
  const playerHill = document.getElementById("playerHill");

  oppHill?.setAttribute("player-id", String(oppId));
  playerHill?.setAttribute("player-id", String(playerId));

  const endTurnButton = document.querySelector(".endTurn-button");
  endTurnButton?.setAttribute("round-played", roundId);
}
