import { router } from "../src/pages/routing";
import { createCard } from "./pages/Arena/cardArena";
import { countCards } from "./pages/Arena/laneArena";
import { addCardToOppTrench, clearTrench } from "./pages/Arena/trenchArena";
import { io } from "socket.io-client";
import { showLobbyPage } from "./pages/Lobby/lobby";
import { startgame } from "./pages/Arena/game";
import { showResult } from "./pages/Arena/showResult";

export const socket = io("http://localhost:5173", {
	reconnection: true,
	reconnectionAttempts: Infinity,
	reconnectionDelay: 1000,
	reconnectionDelayMax: 5000,
	timeout: 20000,
});

socket.on("update", update);

export async function update(...cardData: any) {
  const opp = document.querySelector("#oppHill");
  const oppId = Number(opp?.getAttribute("player-id"));
  const player = document.querySelector("#playerHill");
  const playerId = Number(player?.getAttribute("player-id"));
  const endTurnBtn = document.querySelector(
    ".endTurn-button"
  ) as HTMLButtonElement;
  console.log("cardData", cardData);
  const roundId = endTurnBtn?.getAttribute("round-played");
  if (
    cardData[0].player_id === oppId &&
    cardData[0].round_id === Number(roundId)
  ) {
    const cardPlayed = createCard(cardData[0]);
    addCardToOppTrench(cardPlayed);
    endTurnBtn?.removeAttribute("card-played");
    endTurnBtn.disabled = false;
    const modal = document.querySelector("#modal");
    const roundCounter = document.querySelector(".round-indicator")
      ?.innerHTML as string;
    const round = Number(roundCounter.substring(6, 7));
    modal?.remove();
    const totalMoves = countCards();
    if (totalMoves >= 6) {
      clearTrench();
      await startgame(playerId, oppId);
    }
    if (totalMoves === 2 && round === 3) {
      console.log("it is going through here main.ts")
      showResult("win");
      //person receives from web socket
      console.log("END GAME");
      clearTrench();
      await showLobbyPage();
    }
  }
}

window.addEventListener(
	"DOMContentLoaded",
	async function () {
		if (sessionStorage.getItem("DOMContentLoadedHandled")) {
			return;
		}
		try {
			sessionStorage.setItem("DOMContentLoadedHandled", "true");
			window.addEventListener("popstate", async () => {
				console.log("Event listener: popstate");
				await router();
			});
			await router();
			console.log("Event listener: DOMContentLoaded");
		} catch (error) {
			console.error("Error during page initialization:", error);
		}
	},
	{ once: true }
);

window.addEventListener("beforeunload", () => {
	sessionStorage.removeItem("DOMContentLoadedHandled");
});

window.onload = () => {
	console.log("page is fully loaded");
};
