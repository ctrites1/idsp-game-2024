// import { createPlayerHand } from "../Arena/cardArena";

// export async function displayDeckChoice(gamestate: any) {
//   const body = document.querySelector("body") as HTMLBodyElement;
//   const modal = document.createElement("div");
//   modal.className = "modal";
//   modal.id = "modal";

//   const modalContent = document.createElement("div");
//   modalContent.className = "modal-content";

//   const modalText = document.createElement("p");
//   modalText.id = "modal-text";
//   modalText.textContent = "Choose your Element";

//   const iceBtn = document.createElement("button");
//   iceBtn.innerHTML = "ICE";
//   iceBtn.type = "submit";
//   iceBtn.addEventListener("click", async () => {
//     await chooseIceDeck(gamestate);
//   });
//   const waterBtn = document.createElement("button");
//   waterBtn.innerHTML = "WATER";
//   waterBtn.type = "submit";
//   waterBtn.addEventListener("click", async () => {
//     await chooseWaterDeck(gamestate);
//   });
//   const fireBtn = document.createElement("button");
//   fireBtn.innerHTML = "FIRE";
//   fireBtn.type = "submit";
//   fireBtn.addEventListener("click", async () => {
//     await chooseFireDeck(gamestate);
//   });

//   modalContent.appendChild(modalText);
//   modalContent.appendChild(iceBtn);
//   modalContent.appendChild(waterBtn);
//   modalContent.appendChild(fireBtn);

//   modal.appendChild(modalContent);
//   body.appendChild(modal);

//   modal.style.display = "block";
// }

// async function chooseIceDeck(gamestate: any) {
//   const modal = document.querySelector(".modal");
//   modal?.remove();
//   const response = await fetch("/api/playerhand", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       round_id: gamestate.round_id,
//       player_deck_choice: 3,
//       opp_id: gamestate.oppId,
//     }),
//     credentials: "include",
//   });
//   const data = await response.json();
//   createPlayerHand(data);
// }

// async function chooseWaterDeck(gamestate: any) {
//   const modal = document.querySelector(".modal");
//   modal?.remove();
//   const response = await fetch("/api/playerhand", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       round_id: gamestate.round_id,
//       player_deck_choice: 1,
//       opp_id: gamestate.oppId,
//     }),
//     credentials: "include",
//   });
//   const data = await response.json();
//   createPlayerHand(data);
// }

// async function chooseFireDeck(gamestate: any) {
//   const modal = document.querySelector(".modal");
//   modal?.remove();
//   const response = await fetch("/api/playerhand", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       round_id: gamestate.round_id,
//       player_deck_choice: 2,
//       opp_id: gamestate.oppId,
//     }),
//     credentials: "include",
//   });
//   const data = await response.json();
//   createPlayerHand(data);
// }

import { createPlayerHand } from "../Arena/cardArena";

export async function displayDeckChoice(gamestate: any) {
  const body = document.querySelector("body") as HTMLBodyElement;
  const chooseDeck = document.createElement("div");
  chooseDeck.className = "chooseDeck";
  chooseDeck.id = "chooseDeck";

  const chooseDeckContent = document.createElement("div");
  chooseDeckContent.className = "chooseDeck-content";

  const chooseDeckText = document.createElement("p");
  chooseDeckText.id = "chooseDeck-text";
  chooseDeckText.textContent = "Choose your Element";

  const iceBtn = document.createElement("button");
  iceBtn.innerHTML = "ICE";
  iceBtn.className = "iceBtn";
  iceBtn.type = "submit";
  iceBtn.addEventListener("click", async () => {
    await chooseIceDeck(gamestate);
  });
  const waterBtn = document.createElement("button");
  waterBtn.innerHTML = "WATER";
  waterBtn.className = "waterBtn";
  waterBtn.type = "submit";
  waterBtn.addEventListener("click", async () => {
    await chooseWaterDeck(gamestate);
  });
  const fireBtn = document.createElement("button");
  fireBtn.innerHTML = "FIRE";
  fireBtn.className = "fireBtn";
  fireBtn.type = "submit";
  fireBtn.addEventListener("click", async () => {
    await chooseFireDeck(gamestate);
  });

  chooseDeck.appendChild(chooseDeckText);
  chooseDeckContent.appendChild(iceBtn);
  chooseDeckContent.appendChild(waterBtn);
  chooseDeckContent.appendChild(fireBtn);

  chooseDeck.appendChild(chooseDeckContent);

  body.appendChild(chooseDeck);

  chooseDeck.style.display = "block";
}

async function chooseIceDeck(gamestate: any) {
  const chooseDeck = document.querySelector(".chooseDeck");
  chooseDeck?.remove();
  const response = await fetch("/api/playerhand", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      round_id: gamestate.round_id,
      player_deck_choice: 3,
      opp_id: gamestate.oppId,
    }),
    credentials: "include",
  });
  const data = await response.json();
  createPlayerHand(data);
}

async function chooseWaterDeck(gamestate: any) {
  const chooseDeck = document.querySelector(".chooseDeck");
  chooseDeck?.remove();
  const response = await fetch("/api/playerhand", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      round_id: gamestate.round_id,
      player_deck_choice: 1,
      opp_id: gamestate.oppId,
    }),
    credentials: "include",
  });
  const data = await response.json();
  createPlayerHand(data);
}

async function chooseFireDeck(gamestate: any) {
  const chooseDeck = document.querySelector(".chooseDeck");
  chooseDeck?.remove();
  const response = await fetch("/api/playerhand", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      round_id: gamestate.round_id,
      player_deck_choice: 2,
      opp_id: gamestate.oppId,
    }),
    credentials: "include",
  });
  const data = await response.json();
  createPlayerHand(data);
}

