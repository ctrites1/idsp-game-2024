import {getCardData} from "./areas/Arena/Card";
import {createHomepage} from "./areas/Homepage/homepage";
import {loginAsPlayer1, loginAsPlayer2, logout} from "./areas/Homepage/choosePlayer";

document.addEventListener("DOMContentLoaded", async () => {
  await createHomepage();
  const player1Button = document.querySelector(".player1-btn") as HTMLButtonElement;
  const player2Button = document.querySelector(".player2-btn") as HTMLButtonElement;

  player1Button.addEventListener("click", loginAsPlayer1);
  player2Button.addEventListener("click", loginAsPlayer2);
});

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
