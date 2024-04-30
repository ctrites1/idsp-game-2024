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

export function addCardToHand(data: any) {
	//TODO: change data type, determine where the card data is coming from
	const card = document.createElement("div");

	card.addEventListener("click", () => {
		viewSingleCard(card);
	});
}
