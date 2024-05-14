import { logout } from "../Homepage/choosePlayer";
import { createHomepage } from "../Homepage/homepage";
import { setupDropZones } from "./cardArena";
import { logMove } from "./trenchArena";

export async function createArenaPage() {
  const body = document.querySelector("body") as HTMLBodyElement;
  const content: string = `
        <header><div class="header-btns">
            <button type="button" class="home-button">
            </button>
            <button type="button" class="howTo-button">
            </button>
        </div>
            <div class="round-indicator">Round 1/3
            </div>
            <div class="oppInfo">
                    <div class="oppName">
                        Player 2
                    </div>
                    <div class="oppPic">
                        <img id="oppDisplayPic" src="/assets/update/oppPic.png">
                    </div>
                </div>

            </div>
        </header>
        <div class="arena">

            <div class="lane">
                <div class="trench" id="oppTrench">
                    <div class="cardHolder"></div>
                    <div class="cardHolder"></div>
                    <div class="cardHolder"></div>
                </div>

                <div class="hill">
                    <div class="scoreDisplay">
                        <div id="oppHill">0</div>
                        <div id="playerHill">0</div>
                    </div>
                    <img src="/assets/Hills/waterHill.svg" alt="water hill">
                </div>

                <div class="trench" id="playerTrench">
                    <div class="cardHolder"></div>
                    <div class="cardHolder"></div>
                    <div class="cardHolder"></div>
                </div>
            </div>

            <div class="singleCardView">
                <div class="cardViewFooter">
                </div>
            </div>
        <footer id="playerFooter">
            <div class="playInfo">
                <div class="playerInfo">
                    <div class="playerPic">
                        <img id="displayPic" src="/assets/update/displayPic.png">
                    </div>
                    <div class="playerName">
                        Player 1
                    </div>
                </div>
                <div class="turn-indicator">Turn 1/3
                </div>
            </div>
                <div class="playerHand" id="playerHandContainer">
                </div>
                <div class="playerDeck"></div>
                <div class="action-buttons">
                    <button class="endTurn-button" type="button">End Turn</button>
                    <button class="surrender-button" type="button">Surrender</button>
                    <button class="log-button" type="button">Log</button>
                </div>
        </footer>
    `;
  body.innerHTML = content;

  //* For demo, should refactor later - maybe not use class for footer for easier function calls?
  const surrenderButton = document.querySelector(
    ".surrender-button"
  ) as HTMLButtonElement;
  surrenderButton.addEventListener("click", () => {
    console.log("Surrender clicked");
    location.reload();
    // TODO: Logic to handle log viewing to be added here
  });

  const homeButton = document.querySelector(
    ".home-button"
  ) as HTMLButtonElement;
  homeButton?.addEventListener("click", async () => {
    await logout();
    await createHomepage();
  });

  const endTurnButton = document.querySelector(
    ".endTurn-button"
  ) as HTMLButtonElement;
  endTurnButton?.addEventListener("click", logMove);
  // TODO: Block user from playing anything after turn has ended

  setupDropZones();
}
