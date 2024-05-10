import { clearHillScores, updateHillScores } from "./Hill";

export function addCardToTrench(cards: any, playerId: number) {
	let trenchCardsCounter: number = 0;

	const trench = document.querySelector("#playerTrench")!;

	// if (playerId != cards.playerId) {
	// 	const trench = document.querySelector("#oppTrench")!;
	// }
	const cardHolders = trench.querySelectorAll(".cardHolder");
	// cards.forEach((card) => {

	// })
	// Array.from(cardHolders).map((holder) => {
	// 	if (holder.hasChildNodes()) {
	// 		return;
	// 	} else {
	// 		holder.appendChild(element);
	// 		trenchCardsCounter += 1;
	// 	}
	// });

	updateHillScores();
}

export function clearTrench() {
	const trench = document.querySelector("#playerTrench")!;
	const cardHolders = trench.querySelectorAll(".cardHolder");
	Array.from(cardHolders).map((holder) => {
		holder.innerHTML = "";
	});

	clearHillScores();
}
