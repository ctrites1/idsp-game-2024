export function addCardToTrench(element: HTMLDivElement) {
	const trench = document.querySelector("#playerTrench")!;
	const cardHolders = trench.querySelectorAll(".cardHolder");
	Array.from(cardHolders).map((holder) => {
		if (holder.hasChildNodes()) {
			return;
		} else {
			holder.appendChild(element);
		}
	});
}
