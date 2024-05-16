import { clearHillScores, updateHillScores } from "./Hill";

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

export async function totalMoves() {
	const endTurnButton = document.querySelector(".endTurn-button");
	const roundId = endTurnButton?.getAttribute("round-played");
	console.log(roundId);
	const reqMoves = await fetch("/api/countTotalMoves", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			roundId: roundId,
		}),
	});
	const totalMoves = await reqMoves.json();
	console.log("Moves: ", totalMoves); // TEST
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
			}),
		});
	} else {
		console.log("No move to be logged");
	}
}
