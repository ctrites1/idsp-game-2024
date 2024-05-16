const modal = document.getElementById("modal") as HTMLDivElement | null;
const closeButton = document.querySelector(".close-button") as HTMLSpanElement | null;
const modalText = document.getElementById("modal-text") as HTMLParagraphElement | null;

function showResult(result: 'win' | 'lose'): void {
    if (modal && modalText) {
        modal.style.display = "block";
        if (result === 'win') {
            modalText.textContent = "You Win!";
            modalText.style.color = "dark green";
        } else {
            modalText.textContent = "You Lose!";
            modalText.style.color = "dark red";
        }
    } else {
        console.error('Modal or modal text element not found');
    }
}

if (closeButton) {
    closeButton.addEventListener("click", () => {
        if (modal) {
            modal.style.display = "none";
        }
        nextRound();
    });
} else {
    console.error('Close button not found');
}

window.addEventListener("click", (event: MouseEvent) => {
    if (event.target === modal) {
        if (modal) {
            modal.style.display = "none";
        }
        nextRound();
    }
});

function nextRound() {
    console.log("Proceeding to the next round...");
    startNextRound();
}


function startNextRound() {
//TODO: place holder for starting next round logic
    console.log("Next round setup...");
}


// ! Use case
// if (playerScore > opponentScore) {
//     showResult('win');
// } else {
//     showResult('lose');
// }