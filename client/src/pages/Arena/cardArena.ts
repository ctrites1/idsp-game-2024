import { displayDeckChoice } from "../Lobby/deckChoice";
import { updateHillScores } from "./hillArena";

/* ------------------------------- Drag & Drop ------------------------------ */
function isDragEvent(event: Event): event is DragEvent {
  return "dataTransfer" in event;
}

export function dragstartHandler(event: Event) {
  if (isDragEvent(event) && event.dataTransfer) {
    // Setting data for the drag and specifying that the drag allows for moving the element.
    event.dataTransfer.setData("text/plain", (event.target as HTMLElement).id);
    event.dataTransfer.effectAllowed = "move";

    // Logging the start of dragging.
    console.log(
      `Dragging started for element with ID: ${
        (event.target as HTMLElement).id
      }`
    );
  } else {
    console.error("Failed to handle drag event due to missing dataTransfer");
  }
}

function checkIfCardPlayedThisTurn(cardId: string) {
  const endTurnButton: HTMLButtonElement =
    document.querySelector(".endTurn-button")!;
  console.log("test: ", endTurnButton.attributes.getNamedItem("card-played"));
  if (!endTurnButton.attributes.getNamedItem("card-played")) {
    endTurnButton.setAttribute("card-played", cardId);
    return false; // card has NOT been played this turn
  } else {
    return true; // card HAS been played this turn
  }
}

export function setupDropZones() {
  const trenchHolders = document.querySelectorAll("#playerTrench .cardHolder");
  console.log(`Found ${trenchHolders.length} drop zones.`); // Check how many were found

  trenchHolders.forEach((holder) => {
    holder.addEventListener("dragover", (event) => {
      event.preventDefault();
      console.log("Hovering hover active drop zone");
    });

    holder.addEventListener("dragenter", (event) => {
      event.preventDefault();
      holder.classList.add("drag-hover-glow");
    });

    holder.addEventListener("dragleave", (event) => {
      event.preventDefault();
      holder.classList.remove("drag-hover-glow");
    });

    holder.addEventListener("drop", (event) => {
      event.preventDefault();
      holder.classList.remove("drag-hover-glow");
    });

    holder.addEventListener("drop", (event) => {
      event.preventDefault();
      holder.classList.remove("drag-hover-glow");
      if (isDragEvent(event) && event.dataTransfer) {
        const cardId = event.dataTransfer.getData("text/plain");
        const card = document.querySelector(
          `.playerHand #${cardId}`
        ) as HTMLElement;
        if (card && !holder.hasChildNodes()) {
          if (!checkIfCardPlayedThisTurn(cardId)) {
            moveCardToTrench(card);
            console.log(`Card with ID: ${cardId} moved to new holder`);
          } else {
            console.log("Cannot play more than 1 card per turn");
            return;
          }
        }
      }
    });
  });

  const playerHand = document.querySelector(".playerHand") as HTMLDivElement;
  playerHand.addEventListener("dragover", (event) => {
    event.preventDefault();
    console.log("Hovering hover active drop zone");
  });

  playerHand.addEventListener("dragenter", (event) => {
    event.preventDefault();
    playerHand.classList.add("drag-hover-glow");
  });

  playerHand.addEventListener("dragleave", (event) => {
    event.preventDefault();
    playerHand.classList.remove("drag-hover-glow");
  });

  playerHand.addEventListener("drop", (event) => {
    event.preventDefault();
    playerHand.classList.remove("drag-hover-glow");
    if (isDragEvent(event) && event.dataTransfer) {
      const cardId = event.dataTransfer.getData("text/plain");
      const card = document.querySelector(
        `#playerTrench #${cardId}`
      ) as HTMLElement;
      console.log("Card classes: ", card.classList);
      if (card.classList.contains("just-played")) {
        moveCardBackToHand(card);
      }
    }
  });
}

/* ---------------------------------- Cards --------------------------------- */

export function moveCardBackToHand(card: HTMLElement) {
  const hand = document.querySelector(".playerHand") as HTMLDivElement;
  const newHolder = document.createElement("div");
  newHolder.classList.add("cardHolder");
  newHolder.appendChild(card);
  card.classList.remove("just-played");
  hand.appendChild(newHolder);
  const endTurnBtn = document.querySelector(
    ".endTurn-button"
  ) as HTMLButtonElement;
  endTurnBtn.removeAttribute("card-played");
  updateHillScores();
}

export function moveCardToTrench(card: HTMLElement) {
  const trench = document.querySelector("#playerTrench")!;
  const cardHolders = trench.querySelectorAll(".cardHolder");
  const emptyHolder = Array.from(cardHolders).find(
    (holder) => !holder.hasChildNodes()
  );

  if (emptyHolder) {
    const currentCardHolder = card.closest(".cardHolder");
    emptyHolder.appendChild(card);
    emptyHolder.prepend();

    if (currentCardHolder && !trench.contains(currentCardHolder)) {
      currentCardHolder.parentNode?.removeChild(currentCardHolder);
    }
    updateHillScores();
    card.classList.add("just-played");
    card.draggable = true;
  }
}

export function viewSingleCard(card: HTMLElement) {
  const bigCard = card.cloneNode(true) as HTMLDivElement;
  const poppedCard: HTMLDivElement = document.querySelector(".singleCardView")!;
  poppedCard.innerHTML = "";
  poppedCard.appendChild(bigCard);
  poppedCard.style.display = "flex";

  // Closing the view when clicking outside the card
  poppedCard.addEventListener("click", function (event) {
    if (event.target === poppedCard) {
      poppedCard.style.display = "none";
      poppedCard.removeChild(bigCard);
    }
  });
}

export async function getHandData(gamestate: any) {
  const response = await fetch("/api/playerhand", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      round_id: gamestate.round_id,
      player_deck_choice: gamestate.player_deck_choice,
      opp_id: gamestate.oppId,
    }),
    credentials: "include", // Ensures cookies are sent with the req
  });
  const data = await response.json();
  if (!data.success) {
    await displayDeckChoice(gamestate);
    return;
  }
  createPlayerHand(data);
}

export function createCard(data: any) {
  const card: HTMLDivElement = document.createElement("div");
  card.id = `card-${data.card_id}`;
  card.classList.add("card");
  card.draggable = true;
  card.setAttribute("data-power", String(data.power));

  const cardInside: HTMLDivElement = document.createElement("div");
  cardInside.classList.add("card-inside");
  const cardName: string = data.name.replaceAll(" ", "");

  const cardFront: HTMLDivElement = document.createElement("div");
  cardFront.classList.add("card-front");
  cardFront.style.backgroundImage = `url('/assets/Cards/${cardName}.svg')`;

  const cardBack: HTMLDivElement = document.createElement("div");
  cardBack.classList.add("card-back");

  cardInside.append(cardFront, cardBack);
  card.appendChild(cardInside);

  card.addEventListener("click", () => {
    viewSingleCard(card);
  });
  card.addEventListener("dragstart", dragstartHandler);

  return card;
}

export function createPlayerHand(data: any) {
  const hand: HTMLDivElement = document.querySelector(".playerHand")!;
  const trench: HTMLDivElement = document.querySelector("#playerTrench")!;
  const cards = trench.querySelectorAll(".card")!;
  const cardsPlayed = Array.from(cards).map((c) => {
    return Number(c.id.substring(5, 7));
  });
  data.hand.map((cardData: any) => {
    if (cardsPlayed.includes(cardData.card_id)) {
      return;
    }
    const cardHolder: HTMLDivElement = document.createElement("div");
    cardHolder.classList.add("cardHolder");
    const card = createCard(cardData);
    cardHolder.appendChild(card);
    hand.appendChild(cardHolder);
  });
}
