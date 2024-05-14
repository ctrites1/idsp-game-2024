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
