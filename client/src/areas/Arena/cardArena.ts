import { dragstartHandler, moveCardToTrench } from "./Card";

export function removeCardFromHand(card: HTMLElement) {
  const holder = card.closest("cardHolder");
  holder?.removeChild(card);
}

export function viewSingleCard(card: HTMLElement) {
  const bigCard = card.cloneNode(true) as HTMLDivElement;

  const poppedCard: HTMLDivElement = document.querySelector(".singleCardView")!;
  poppedCard?.appendChild(bigCard);
  poppedCard.style.display = "flex";

  const playBtn: HTMLButtonElement = poppedCard.querySelector(".playCard")!;
  const closeBtn: HTMLButtonElement = poppedCard.querySelector(".close")!;

  const playCardHandler = () => {
    removeCardFromHand(card);
    moveCardToTrench(card);
    poppedCard.style.display = "none";
    poppedCard.removeChild(bigCard);
  };

  playBtn.addEventListener("click", playCardHandler);

  closeBtn.addEventListener("click", () => {
    poppedCard.style.display = "none";
    poppedCard.removeChild(bigCard);
    playBtn.removeEventListener("click", playCardHandler);
  });
}

export async function getCardData(gamestate: any) {
  console.log("Sending request to /api/playerhand");
  const response = await fetch('/api/playerhand', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      round_id: gamestate.round_id, 
      player_deck_choice: 1,
      opp_id: gamestate.oppId,
    }),
    credentials: 'include' // Ensures cookies are sent with the request
  })

  const data = await response.json();
  console.log("data", data);
  createPlayerHand(data);
}

export function createCard(data: any) {

  const card = document.createElement("div");
  card.id = `card-${data.card_id}`;
  card.classList.add("card");
  card.draggable = true;

  card.classList.add("card");

  card.setAttribute("data-power", String(data.power));

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
  // const cardDescription = document.createElement("li");
  // cardDescription.textContent = data.description;

  cardFrontText.append(cardPower, cardName);
  cardFront.appendChild(cardFrontText);

  const cardBack = document.createElement("div");
  cardBack.classList.add("card-back");

  cardInside.append(cardFront, cardBack);
  card.append(cardInside);

  card.addEventListener("click", () => viewSingleCard(card));
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
