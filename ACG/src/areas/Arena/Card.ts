import{Card} from '../../../database';

import { updateHillScores } from "./Hill";

export function moveCardToTrench(card: HTMLElement) {
  const trench = document.querySelector("#playerTrench")!;
  const cardHolders = trench.querySelectorAll(".cardHolder");
  const emptyHolder = Array.from(cardHolders).find(holder => !holder.hasChildNodes());

  if (emptyHolder) {
    const currentCardHolder = card.closest(".cardHolder");
    emptyHolder.appendChild(card);

    if (currentCardHolder && !trench.contains(currentCardHolder)) {
      currentCardHolder.parentNode?.removeChild(currentCardHolder);
    }
  }
}

export function removeCardFromHand(card: HTMLElement) {
  const holder = card.closest(".cardHolder");
  holder?.removeChild(card);
}

export function viewSingleCard(card: HTMLElement) {
  const bigCard = card.cloneNode(true) as HTMLDivElement;
  const poppedCard: HTMLDivElement = document.querySelector(".singleCardView")!;
  poppedCard.appendChild(bigCard);
  poppedCard.style.display = "flex";

  const closeBtn: HTMLButtonElement = poppedCard.querySelector(".close")!;
  closeBtn.addEventListener("click", () => {
    poppedCard.style.display = "none";
    poppedCard.removeChild(bigCard);
  });
}

export function createCard(data: any) {
  const card = document.createElement("div");
  card.id = `card-${data.id}`;
  card.classList.add("card");
  card.draggable = true;

  const cardInside = document.createElement("div");
  cardInside.classList.add("card-inside");

  const cardFront = document.createElement("div");
  cardFront.classList.add("card-front");
  cardFront.style.backgroundImage = "url('/assets/Water/EmptyCardFront.svg')";

  const cardFrontText = document.createElement("ul");
  const cardName = document.createElement("li");
  cardName.textContent = data.name;
  const cardPower = document.createElement("li");
  cardPower.textContent = `${data.power}`;
  const cardDescription = document.createElement("li");
  cardDescription.textContent = data.description;

  cardFrontText.append(cardPower, cardName, cardDescription);
  cardFront.appendChild(cardFrontText);

  const cardBack = document.createElement("div");
  cardBack.classList.add("card-back");

  cardInside.append(cardFront, cardBack);
  card.append(cardInside);

  card.addEventListener("click", () => viewSingleCard(card));
  card.addEventListener("dragstart", dragstartHandler);

  return card;
}

export async function getCardData() {
  const response = await fetch("/api/playerhand");
  const data = await response.json();
  createPlayerHand(data);
}

export function createPlayerHand(cards: Card[]): void {
  const hand = document.querySelector(".playerHand")!;
  cards.forEach((cardData) => {
    const cardHolder = document.createElement("div");
    cardHolder.classList.add("cardHolder");
    const cardElement = createCard(cardData); 
    cardHolder.appendChild(cardElement);
    hand.appendChild(cardHolder);
  });
}

function isDragEvent(event: Event): event is DragEvent {
  return 'dataTransfer' in event;
}

export function dragstartHandler(event: Event) {
  if (isDragEvent(event) && event.dataTransfer) {
    // Setting data for the drag and specifying that the drag allows for moving the element.
    event.dataTransfer.setData('text/plain', (event.target as HTMLElement).id);
    event.dataTransfer.effectAllowed = 'move';

    // Logging the start of dragging.
    console.log(`Dragging started for element with ID: ${(event.target as HTMLElement).id}`);
  } else {
    console.error('Failed to handle drag event due to missing dataTransfer');
  }
}

export function setupDropZones() {
  const cardHolders = document.querySelectorAll("#playerTrench .cardHolder");
  console.log(`Found ${cardHolders.length} drop zones.`);  // Check how many were found
  cardHolders.forEach(holder => {
    console.log('Setting up drop zone');  // Confirm setup
    holder.addEventListener("dragover", event => {
      event.preventDefault(); // Necessary to allow for the drop event to fire
      console.log('Drag over active zone');  // Debugging dragover activity
    });

    holder.addEventListener("drop", event => {
      event.preventDefault();
      console.log('Drop event triggered');  // Debugging drop activity
      if (isDragEvent(event) && event.dataTransfer) {
        const cardId = event.dataTransfer.getData("text/plain");
        const card = document.getElementById(cardId);
        if (card && !holder.hasChildNodes()) {
          moveCardToTrench(card);
          console.log(`Card with ID: ${cardId} moved to new holder`);
        }
      }
    });
  });
}


document.addEventListener('DOMContentLoaded', () => {
  setupDropZones();
});