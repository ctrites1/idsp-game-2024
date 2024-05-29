export function showRoundChange(roundCount:number): void {
    const body = document.querySelector("body") as HTMLBodyElement;
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "modal";
  
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
  
    const modalText = document.createElement("p");
    modalText.id = "modal-text";
    modalText.textContent = `Round ${roundCount}`;
  
    modalContent.appendChild(modalText);
    modal.appendChild(modalContent);
    body.appendChild(modal);
  
    modal.style.display = "block";

       // track animation end to close
       modalContent.addEventListener("animationend", () => {
        modal.style.display = "none";
        body.removeChild(modal);
    });
  
    // clock outside to close
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
        body.removeChild(modal);
      }
    });
  }

  