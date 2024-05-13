//import {getCardData} from "./areas/Arena/";
import {createHomepage} from "./areas/Homepage/homepage";
import {loginAsPlayer1, loginAsPlayer2, logout} from "./areas/Homepage/choosePlayer";

document.addEventListener("DOMContentLoaded", async () => {
  await createHomepage();
  //getCardData();
  const player1Button = document.querySelector(".player1-btn") as HTMLButtonElement;
  const player2Button = document.querySelector(".player2-btn") as HTMLButtonElement;

  player1Button.addEventListener("click", loginAsPlayer1);
  player2Button.addEventListener("click", loginAsPlayer2);
});

const endTurnButton = document.querySelector(".endTurn-button") as HTMLElement;
endTurnButton.addEventListener("click", async () => {
  console.log("end button clicked");

  const response = await fetch('/api/logmove', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roundId: 6, })
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
const surrenderButton = document.querySelector(".surrender-button") as HTMLButtonElement;
surrenderButton.addEventListener("click", () => {
  console.log("Surrender clicked");
  location.reload();
  // TODO: Logic to handle log viewing to be added here
});

const homeButton = document.querySelector(".home-button") as HTMLButtonElement;
homeButton?.addEventListener("click", async () => {
  await logout();
  await createHomepage();
  const player1Button = document.querySelector(".player1-btn") as HTMLButtonElement;
  const player2Button = document.querySelector(".player2-btn") as HTMLButtonElement;

  player1Button.addEventListener("click", loginAsPlayer1);
  player2Button.addEventListener("click", loginAsPlayer2);
});
