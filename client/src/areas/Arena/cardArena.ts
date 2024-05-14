import { updateHillScores } from "./Hill";

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
    return false;
  } else {
    return true; // card HAS been played this turn
  }
}

export function setupDropZones() {
  const cardHolders = document.querySelectorAll("#playerTrench .cardHolder");
  console.log(`Found ${cardHolders.length} drop zones.`); // Check how many were found

  cardHolders.forEach((holder) => {
    console.log("Setting up drop zone"); // Confirm setup
    holder.addEventListener("dragover", (event) => {
      event.preventDefault(); // Necessary to allow for the drop event to fire
      console.log("Drag over active zone"); // Debugging dragover activity
    });

    holder.addEventListener("drop", (event) => {
      event.preventDefault();

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
}

/* ---------------------------------- Cards --------------------------------- */
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
  }
}

export function removeCardFromHand(card: HTMLElement) {
  const holder = card.closest(".cardHolder");
  holder?.removeChild(card);
}

export function viewSingleCard(card: HTMLElement) {
  const bigCard = card.cloneNode(true) as HTMLDivElement;
  const poppedCard: HTMLDivElement = document.querySelector(".singleCardView")!;
  poppedCard.innerHTML = "";
  poppedCard.appendChild(bigCard);
  poppedCard.style.display = "flex";

  // Added event listener for closing the view when clicking outside the card
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
      player_deck_choice: 1,
      app_id: gamestate.oppId,
    }),
    credentials: "include", // Ensures cookies are sent with the req
  });
  const data = await response.json();
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

  const cardFront: HTMLDivElement = document.createElement("div");
  cardFront.classList.add("card-front");
  cardFront.style.backgroundImage = "url('/assets/Water/EmptyCardFront.svg')";

  const cardFrontText: HTMLUListElement = document.createElement("ul");
  const cardName = document.createElement("li");
  cardName.textContent = data.name;
  const cardPower = document.createElement("li");
  cardPower.textContent = `${data.power}`;

  cardFrontText.append(cardPower, cardName);
  cardFront.appendChild(cardFrontText);

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
  data.hand.map((cardData: any) => {
    const cardHolder: HTMLDivElement = document.createElement("div");
    cardHolder.classList.add("cardHolder");
    const card = createCard(cardData);
    cardHolder.appendChild(card);
    hand.appendChild(cardHolder);
  });
}
