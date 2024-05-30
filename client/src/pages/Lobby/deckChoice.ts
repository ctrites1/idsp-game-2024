import { createPlayerHand } from "../Arena/cardArena";

export async function displayDeckChoice(gamestate: any) {
  const body = document.querySelector("body") as HTMLBodyElement;
  const chooseDeck = document.createElement("div");
  chooseDeck.className = "chooseDeck";
  chooseDeck.id = "chooseDeck";

  const chooseDeckContent = document.createElement("div");
  chooseDeckContent.className = "chooseDeck-content";

  const chooseDeckContentText = document.createElement("div");
  chooseDeckContentText.className = "chooseDeck-contentText"

  const chooseDeckText = document.createElement("p");
  chooseDeckText.id = "chooseDeck-text";
  chooseDeckText.textContent = "Choose your Element";

  const iceBtn = document.createElement("button");
  iceBtn.className = "iceBtn";
  iceBtn.type = "submit";
  iceBtn.innerHTML = "ICE";
  iceBtn.addEventListener("click", async () => {
    await chooseIceDeck(gamestate);
  });

  // const iceName = document.createElement("p");
  // iceName.textContent = "ICE";

  // const fireName = document.createElement("p");
  // fireName.textContent = "FIRE";

  // const waterName = document.createElement("p");
  // waterName.textContent = "WATER";

  const waterBtn = document.createElement("button");
  waterBtn.className = "waterBtn";
  waterBtn.innerHTML = "WATER";
  waterBtn.type = "submit";
  waterBtn.addEventListener("click", async () => {
    await chooseWaterDeck(gamestate);
  });
  const fireBtn = document.createElement("button");
  fireBtn.className = "fireBtn";
  fireBtn.innerHTML = "FIRE";
  fireBtn.type = "submit";
  fireBtn.addEventListener("click", async () => {
    await chooseFireDeck(gamestate);
  });

  chooseDeck.appendChild(chooseDeckText);
  chooseDeckContent.appendChild(iceBtn);
  chooseDeckContent.appendChild(waterBtn);
  chooseDeckContent.appendChild(fireBtn);
  // chooseDeckContentText.appendChild(iceName);
  // chooseDeckContentText.appendChild(waterName);
  // chooseDeckContentText.appendChild(fireName);

  chooseDeck.appendChild(chooseDeckContent);
  // chooseDeck.appendChild(chooseDeckContentText);

  body.appendChild(chooseDeck);
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

