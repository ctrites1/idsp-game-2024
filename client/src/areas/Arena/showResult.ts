export function showResult() {
const body = document.querySelector("body") as HTMLBodyElement;
  const resultPage: HTMLDivElement = document.createElement("div");

  resultPage.className = "resultPage";

  const resultTextDiv: HTMLDivElement = document.createElement("div");
  resultTextDiv.className ="resultText";
	resultPage.innerHTML = "";
	resultPage.appendChild(resultTextDiv);
	resultPage.style.display = "flex";

  body.appendChild(resultPage)
	// Closing the view when clicking outside the card
	resultPage.addEventListener("click", function (event) {
		if (event.target === resultPage) {
			resultPage.style.display = "none";
			resultPage.removeChild(resultTextDiv);
		}


	});
}

// function showResult(result: "win" | "lose"): void {
//   const modal = document.getElementById("modal") as HTMLDivElement | null;
//   const modalText = document.getElementById(
//     "modal-text"
//   ) as HTMLParagraphElement | null;
//   if (modal && modalText) {
//     modal.style.display = "block";
//     if (result === "win") {
//       modalText.textContent = "Victory";
//     } else {
//       modalText.textContent = "Destroyed";
//     }
//   } else {
//     console.error("Modal or modal text element not found");
//   }
// }

// function nextRound() {
//   console.log("Proceeding to the next round...");
//   startNextRound();
// }

// function startNextRound() {
//   //TODO: place holder for starting next round logic
//   console.log("Next round setup...");
// }

// // ! Use case
// // if (playerScore > opponentScore) {
// //     showResult('win');
// // } else {
// //     showResult('lose');
// // }
