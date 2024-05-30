import { createPlayerHand } from "../Arena/cardArena";

export async function displayDeckChoice(gamestate: any) {
  const body = document.querySelector("body") as HTMLBodyElement;
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.id = "modal";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const modalText = document.createElement("p");
  modalText.id = "modal-text";
  modalText.textContent = "Choose your Element";

  const buttonContent = document.createElement("div");
  buttonContent.className = "modal-button";

  const iceBtn = document.createElement("button");
  iceBtn.innerHTML = "ICE";
  iceBtn.type = "submit";
  iceBtn.addEventListener("click", async () => {
    await chooseIceDeck(gamestate);
  });
  const waterBtn = document.createElement("button");
  waterBtn.innerHTML = "WATER";
  waterBtn.type = "submit";
  waterBtn.addEventListener("click", async () => {
    await chooseWaterDeck(gamestate);
  });
  const fireBtn = document.createElement("button");
  fireBtn.innerHTML = "FIRE";
  fireBtn.type = "submit";
  fireBtn.addEventListener("click", async () => {
    await chooseFireDeck(gamestate);
  });

  modalContent.appendChild(modalText);
  buttonContent.appendChild(iceBtn);
  buttonContent.appendChild(waterBtn);
  buttonContent.appendChild(fireBtn);
  modalContent.appendChild(buttonContent);

  modal.appendChild(modalContent);
  body.appendChild(modal);

  modal.style.display = "block";
}

async function chooseIceDeck(gamestate: any) {
  const modal = document.querySelector(".modal");
  modal?.remove();
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
  const modal = document.querySelector(".modal");
  modal?.remove();
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
  const modal = document.querySelector(".modal");
  modal?.remove();
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
