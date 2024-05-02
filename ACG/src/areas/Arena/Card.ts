export function moveCardToTrench(card: HTMLElement) {
	const trench = document.querySelector("#playerTrench")!;
	const cardHolders = trench.querySelectorAll(".cardHolder");
	Array.from(cardHolders).map((holder) => {
		if (holder.hasChildNodes()) {
			return;
		} else {
			holder.appendChild(card);
		}
	});
}

export function removeCardFromHand(card: HTMLElement) {
	const hand = document.querySelector(".playerHand")!;
	hand.removeChild(card);
}

/*  TODO: add event listener to cards -> if card in hand is clicked,
    calls moveCardToTrench function on it, clears card from hand.
    add the event listeners when creating the cards?
*/

export function viewSingleCard(card: HTMLElement) {
	const poppedCard: HTMLDivElement = document.querySelector(".singleCardView")!;
	poppedCard?.appendChild(card);
	poppedCard.style.display = "block";

	const closeBtn: HTMLButtonElement = poppedCard.querySelector(".close")!;
	closeBtn.addEventListener("click", () => {
		poppedCard.style.display = "none";
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
	console.log("Received: ", data);
	return data;
}

export function createCard(data: any) {
	const card: HTMLDivElement = document.createElement("div");
	card.classList.add("card");

	const cardInside: HTMLDivElement = document.createElement("div");
	cardInside.classList.add("card-inside");

	const cardFront: HTMLDivElement = document.createElement("div");
	cardFront.innerText = `Name: ${data.name}, ${data.description}`;
	cardFront.classList.add("card-front");
	const cardFront: HTMLDivElement = document.createElement("div");
	cardFront.classList.add("card-front");

	const cardBack: HTMLDivElement = document.createElement("div");
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
		const card = createCard(cardData);
		hand.appendChild(card);
	});
}
