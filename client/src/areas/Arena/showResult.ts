export function showResult(result: "win" | "lose"): void {
	const body = document.querySelector("body") as HTMLBodyElement;
	const modal = document.createElement("div");
	modal.className = "modal";
	modal.id = "modal";
  
	const modalContent = document.createElement("div");
	modalContent.className = "modal-content";
  
	const closeButton = document.createElement("span");
	closeButton.className = "close";
	closeButton.innerHTML = "&times;";
  
	const modalText = document.createElement("p");
	modalText.id = "modal-text";
  
	if (result === "win") {
	  modalText.textContent = "You Win!";
	  modalText.style.color = "green";
	} else {
	  modalText.textContent = "You Lose!";
	  modalText.style.color = "red";
	}
  
	modalContent.appendChild(closeButton);
	modalContent.appendChild(modalText);
	modal.appendChild(modalContent);
	body.appendChild(modal);
  
	modal.style.display = "block";
  
	closeButton.addEventListener("click", () => {
	  modal.style.display = "none";
	  body.removeChild(modal);
	  // Logic to proceed to the next round
	  nextRound();
	});
  
	window.addEventListener("click", (event) => {
	  if (event.target === modal) {
		modal.style.display = "none";
		body.removeChild(modal);
		nextRound();
	  }
	});
  }
  
  function nextRound() {
	console.log("Proceeding to the next round...");
	startNextRound();
  }
  
  function startNextRound() {
	// Placeholder for starting next round logic
	console.log("Next round setup...");
  }
  