import { clearHillScores, updateHillScores } from "./Hill";

export function addCardToOppTrench(element: HTMLDivElement) {
  const trench = document.querySelector("#oppTrench")!;
  const cardHolders = trench.querySelectorAll(".cardHolder");
  Array.from(cardHolders).map((holder) => {
    if (holder.hasChildNodes()) {
      return;
    } else {
      holder.appendChild(element);
    }
  });

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
