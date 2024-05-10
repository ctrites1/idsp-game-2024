import {getCardData} from "./areas/Arena/cardArena";

document.addEventListener("DOMContentLoaded", () => {
  getCardData();
});

const endTurnButton = document.querySelector(".endTurn-button") as HTMLElement;
endTurnButton.addEventListener("click", async () => {
  console.log("end button clicked");

  const response = await fetch('/api/endTurn', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // body: JSON.stringify({ playerId })
  });
  const data = await response.json();
  if (data.success) {
    window.location.href = '/'; // Go back to homepage
    //playCard(data);
  } else {
    alert(data.error);
  }
})

//* For demo, should refactor later - maybe not use class for footer for easier function calls?
const surrenderButton = document.querySelector(".surrender-button") as HTMLElement;
surrenderButton.addEventListener("click", () => {
  console.log("Surrender clicked");
  location.reload();
  // TODO: Logic to handle log viewing to be added here
});
