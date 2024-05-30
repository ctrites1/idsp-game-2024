import { createCard } from "./cardArena";
import { addCardToOppTrench } from "./trenchArena";

export async function getOppMoves() {
  const opp = document.querySelector("#oppHill");
  const oppId: number = Number(opp?.getAttribute("player-id"));
  const newMove = await fetch("/api/getNewMove", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      oppId,
    }),
  });
  const cardPlayed = createCard(newMove);
  addCardToOppTrench(cardPlayed);
}
