import { getCardData } from "./areas/Arena/Card";

document.addEventListener("DOMContentLoaded", () => {
	const modalCard: HTMLDivElement = document.querySelector(".singleCardView")!;
	modalCard.style.display = "none";

	getCardData();
});
