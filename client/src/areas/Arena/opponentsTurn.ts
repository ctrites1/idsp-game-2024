export function showOpponentsTurn(): void {
    const body = document.querySelector("body") as HTMLBodyElement;
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "modal";
  
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
  
    const modalText = document.createElement("p");
    modalText.id = "modal-text";
    modalText.textContent = "Opponent's Turn";
  
    modalContent.appendChild(modalText);
    modal.appendChild(modalContent);
    body.appendChild(modal);
  
    modal.style.display = "block";
  
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
        body.removeChild(modal);
      }
    });
  }
  
  