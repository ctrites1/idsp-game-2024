import { createCard, getHandData } from "./areas/Arena/cardArena";
import { countCards } from "./areas/Arena/laneArena";
import { addCardToOppTrench } from "./areas/Arena/trenchArena";
import { loginSuccess } from "./areas/Homepage/choosePlayer";
import { createHomepage } from "./areas/Homepage/homepage";
import { io } from "socket.io-client";
import { router } from "../src/pages/routing";

export const socket = io("http://localhost:5173", {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
});

socket.on("message", async (...data) => {
  console.log("WSdata", data);
  if (typeof data === "string") {
    // console.log("UPDATING");
    // await loginAsPlayer1();
  }
});

socket.on("update", async (...cardData) => {
  const opp = document.querySelector("#oppHill");
  const oppId = Number(opp?.getAttribute("player-id"));
  const player = document.querySelector("#playerHill");
  const playerId = Number(player?.getAttribute("player-id"));
  const endTurnBtn = document.querySelector(
    ".endTurn-button"
  ) as HTMLButtonElement;
  if (cardData[0].player_id === oppId || cardData[0].player_id === playerId) {
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
      await loginSuccess();
      await getHandData({
        oppId,
        round_id: cardData[0].round_id,
      });
    }
    if (totalMoves === 2 && round === 3) {
      console.log("END THE GAME NOW");
      await loginSuccess();
      await getHandData({
        oppId,
        round_id: cardData[0].round_id,
      });
    }
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await createHomepage();
  } catch (error) {
    console.error("Error during page initialization:", error);
  }
});
