import { createCard, dragstartHandler, moveCardToTrench } from "./cardArena";
import { addCardToOppTrench } from "./trenchArena";
export let playerState = [];

export async function startgame() {
  const game = await fetch("/api/startgame", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "keeles",
      password: "strongPassword2",
    }),
  });
  const response = await game.json();
  if (!response.gameStarted && response.round_id) {
    const cg = await currentgame();
    console.log(cg.data);
    cg.data.oppMoves.map((m: any) => {
      const oppCard = createCard(m);
      oppCard.removeEventListener("dragstart", dragstartHandler);
      oppCard.draggable = false;
      addCardToOppTrench(oppCard);
    });
    cg.data.playersMoves.map((m: any) => {
      const playerCard = createCard(m);
      playerCard.removeEventListener("dragstart", dragstartHandler);
      playerCard.draggable = false;
      moveCardToTrench(playerCard);
    });
    const endTurnButton = document.querySelector(".endTurn-button");
    endTurnButton?.setAttribute("round-played", cg.data.round_id);
    // const playerHill = document.querySelector("#playerHill")
    // const oppHill = document.querySelector("#oppHill")
    // playerHill?.setAttribute("player-id", cg.data.)
    return cg;
  }
}

export async function currentgame() {
  const game = await fetch("/api/currentgame", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await game.json();
  return response;
}

// let currentMove = {
//     cardId: null,
//     trenchPosition: null
// };

// function stageMove(cardId: any, trenchPosition: any) {
//     currentMove = { cardId, trenchPosition };
//     updateUIMove(cardId, trenchPosition);
// }

// function confirmMove(currentMove: any) {
//     if (!currentMove) {
//         console.error("No move to confirm.");
//         return;
//     }

//     sendMoveToServer(currentMove)
//         .then(response => {
//             if (response.success) {
//                 console.log("Move confirmed and logged.");
//                 currentMove = null; // Clear the staged move
//             } else {
//                 console.error("Failed to log move:", response.message);
//             }
//         })
//         .catch(error => {
//             console.error("Error sending move to server:", error);
//         });
// }

// function undoMove() {
//     currentMove = {
//         cardId: null,
//         trenchPosition: null
//     };
//     revertUIMove(currentMove.cardId, currentMove.trenchPosition);
// }

// async function sendMoveToServer(move: any) {
//     return fetch('/api/logMove', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(move)
//     }).then(response => response.json());
// }

// // function updateUIMove(cardId: any, trenchPosition: any) {
// //     const cardElement = document.getElementById(`card-${cardId}`);
// //     const targetPosition = document.getElementById(`trench-position-${trenchPosition}`);

// //     if (cardElement && targetPosition) {
// //         const clonedCard = cardElement.cloneNode(true);
// //         clonedCard.id = `clone-${cardId}`;
// //         targetPosition.appendChild(clonedCard);

// //         targetPosition.classList.add("highlight-move");
// //     } else {
// //         console.error("Invalid card ID or trench position");
// //     }
// // }

// function revertUIMove(cardId: any, trenchPosition: any) {
//     const targetPosition = document.getElementById(`trench-position-${trenchPosition}`);

//     if (targetPosition) {
//         const clonedCard = document.getElementById(`clone-${cardId}`);
//         if (clonedCard) {
//             targetPosition.removeChild(clonedCard);
//         }

//         targetPosition.classList.remove("highlight-move");
//     } else {
//         console.error("Invalid trench position");
//     }
// }
