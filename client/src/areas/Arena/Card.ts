import { updateHillScores } from "./Hill";

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
  }

}

export function removeCardFromHand(card: HTMLElement) {
	const holder = card.closest("cardHolder");
	holder?.removeChild(card);
}

export function viewSingleCard(card: HTMLElement) {
	const bigCard = card.cloneNode(true) as HTMLDivElement;

	const poppedCard: HTMLDivElement = document.querySelector(".singleCardView")!;
	poppedCard?.appendChild(bigCard);
	poppedCard.style.display = "flex";

	const playbutton: HTMLButtonElement = poppedCard.querySelector(".playCard")!;
	const closeBtn: HTMLButtonElement = poppedCard.querySelector(".close")!;

	const playCardHandler = () => {
		removeCardFromHand(card);
		moveCardToTrench(card);
		poppedCard.style.display = "none";
		poppedCard.removeChild(bigCard);
		updateHillScores();
	};

	playbutton.addEventListener("click", playCardHandler);

	closeBtn.addEventListener("click", () => {
		poppedCard.style.display = "none";
		poppedCard.removeChild(bigCard);
		playBtn.removeEventListener("click", playCardHandler);
	});

	const playBtn: HTMLButtonElement = poppedCard.querySelector(".playCard")!;
	playBtn.addEventListener("click", () => {
		removeCardFromHand(card);
		moveCardToTrench(card);
	});
}

export async function getCardData() {
	const response = await fetch("/api/playerhand");
	const data = await response.json();
	createPlayerHand(data);
}

export function createCard(data: any) {

	const card: HTMLDivElement = document.createElement("div");
	card.classList.add("card");

	card.setAttribute('data-score', data.power);

	const cardInside: HTMLDivElement = document.createElement("div");
	cardInside.classList.add("card-inside");

	const cardFront: HTMLDivElement = document.createElement("div");
	cardFront.classList.add("card-front");
	cardFront.style.backgroundImage = "url('/assets/Water/EmptyCardFront.svg')";

	const cardFrontText: HTMLUListElement = document.createElement("ul");
	const cardName = document.createElement("li");
	cardName.textContent = data.name;	
  const cardPower = document.createElement("li");
	cardPower.textContent = data.power;
	const cardDescription = document.createElement("li");
	cardDescription.textContent = data.description;

	cardFrontText.appendChild(cardPower);
	cardFrontText.appendChild(cardName);
	cardFrontText.appendChild(cardDescription);
	cardFront.appendChild(cardFrontText);

	const cardBack: HTMLDivElement = document.createElement("div");
	// cardBack.style.backgroundImage = `url("/assets/Fire/Fire_Back_1.svg")`;
	// cardBack.style.backgroundSize = "cover";
	// cardBack.style.backgroundPosition = "center";
	cardBack.classList.add("card-back");

	cardInside.appendChild(cardFront);
	card.appendChild(cardInside);

	card.addEventListener("click", () => {
		viewSingleCard(card);
	});

	return card;
}

export function createPlayerHand(data: any) {
	const hand: HTMLDivElement = document.querySelector(".playerHand")!;
	data.map((cardData: any) => {
		const cardHolder: HTMLDivElement = document.createElement("div");
		cardHolder.classList.add("cardHolder");
		const card = createCard(cardData);
		cardHolder.appendChild(card);
		hand.appendChild(cardHolder);
	});
}