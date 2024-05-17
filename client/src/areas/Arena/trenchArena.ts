import { clearHillScores, playersScore, updateHillScores } from "./hillArena";

export function addCardToOppTrench(card: HTMLDivElement) {
	const trench = document.querySelector("#oppTrench")!;
	const cardHolders = trench.querySelectorAll(".cardHolder");
	let counter = 0;
	const trenchPos = Array.from(cardHolders).map((h) => {
		if (h.hasChildNodes()) {
			counter++;
			return counter;
		}
	});
	const emptyHolder = Array.from(cardHolders).find(
		(holder) => !holder.hasChildNodes()
	);

	if (emptyHolder) {
		const currentCardHolder = card.closest(".cardHolder");
		emptyHolder.appendChild(card);
		emptyHolder.setAttribute(`data-trench`, String(trenchPos));

		if (currentCardHolder && !trench.contains(currentCardHolder)) {
			currentCardHolder.parentNode?.removeChild(currentCardHolder);
		}
		updateHillScores();
	}
}

export function clearTrench() {
	const trench = document.querySelector("#playerTrench")!;
	const cardHolders = trench.querySelectorAll(".cardHolder");
	Array.from(cardHolders).map((holder) => {
		holder.innerHTML = "";
	});

	clearHillScores();
}

export async function logMove() {
	const endTurnButton = document.querySelector(".endTurn-button");
	const cardId = endTurnButton?.getAttribute("card-played");
	const roundId = endTurnButton?.getAttribute("round-played");
	const trench = document.querySelector("#playerTrench")!;
	const cardHolders = trench.querySelectorAll(".cardHolder");
	let counter = 0;
	Array.from(cardHolders).map((h) => {
		if (h.hasChildNodes()) {
			counter++;
		}
	});

	const winnerId = playersScore();
	console.log(winnerId);

	const loggedCard = document.querySelector(".just-played");
	if (loggedCard) {
		loggedCard.classList.remove("just-played");
	}

	if (roundId && cardId) {
		console.log("FETCHING");
		await fetch("/api/logmove", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				roundId: Number(roundId),
				cardId: Number(cardId.substring(5, 7)),
				trenchPos: counter,
				winner_id: Number(winnerId),
			}),
		});
	} else {
		console.log("No move to be logged");
	}
}
