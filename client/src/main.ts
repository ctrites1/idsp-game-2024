import { createCard } from "./areas/Arena/cardArena";
import { createArenaPage } from "./areas/Arena/mainArena";
import { addCardToOppTrench } from "./areas/Arena/trenchArena";
import { loginAsPlayer1 } from "./areas/Homepage/choosePlayer";
import { createHomepage } from "./areas/Homepage/homepage";
import { io } from "socket.io-client";

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

socket.on("update", (...cardData) => {
  const opp = document.querySelector("#oppHill");
  const oppId = Number(opp?.getAttribute("player-id"));
  const endTurnBtn = document.querySelector(".endTurn-button");
  if (cardData[0].player_id === oppId) {
    const cardPlayed = createCard(cardData[0]);
    addCardToOppTrench(cardPlayed);
    endTurnBtn?.removeAttribute("card-played");
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await createHomepage();
  } catch (error) {
    console.error("Error during page initialization:", error);
  }
});
