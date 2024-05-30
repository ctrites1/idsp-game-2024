// mainArena.ts

import { setupDropZones } from "./cardArena";
import { clearTrench, logMove } from "./trenchArena";
import { showOpponentsTurn } from "./opponentsTurn";
import { socket } from "../../main";
import { countCards } from "./laneArena";
import { showLobbyPage } from "../Lobby/lobby";
import { startgame } from "./game";
import { createHowToPlayPopup } from "./tutorial";
import { addRouteToBtn } from "../routing";
import { showResult } from "./showResult";

export async function createArenaPage() {
  const body = document.querySelector("body") as HTMLBodyElement;
  const content: string = `
        <header>
          <div class="header-btns">
            <button type="button" class="logout-button">
            </button>
            <button type="button" class="home-button">
            </button>
            <button type="button" class="howTo-button">
            </button>
          </div>
          
          <div class="player-round-log">
          <div class="player-round-3"></div>
          <div class="player-round-1"></div>
          <div class="player-round-2"></div>
          </div>

        <div class="round-indicator">
        </div>
        <div class="opp-round-log">
        <div class="opp-round-1"></div>
        <div class="opp-round-2"></div>
        <div class="opp-round-3"></div>
        </div>
        <div class="oppInfo">
                <div class="oppName">
                </div>
                <div class="oppPic">
                    <img id="oppDisplayPic">
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

            <!-- Stars -->
            <div id="stars"></div>
            <div id="stars2"></div>
            <div id="stars3"></div>
            
        <footer id="playerFooter">
            <div class="playInfo">
                <div class="playerInfo">
                    <div class="playerPic">
                        <img id="displayPic">
                    </div>
                    <div class="playerName">
                    </div>
                </div>
                <div class="turn-indicator">
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

  const surrenderButton = document.querySelector(
    ".surrender-button"
  ) as HTMLButtonElement;

  surrenderButton.addEventListener("click", async () => {
    console.log("Surrender clicked");
    const playerHill = document.querySelector("#playerHill");
    const playerId: number = Number(playerHill?.getAttribute("player-id"));
    const matchId = await getCurrentMatchId(playerId);
    const response = await fetch("/api/surrender", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ matchId }),
    });
    const result = await response.json();
    if (result.success) {
      console.log(`Player surrendered`);
      clearTrench();
      showResult("lose");
      await showLobbyPage();
    } else {
      console.error("Failed to surrender the game:", result.message);
    }
  });

  const homeButton = document.querySelector(
    ".home-button"
  ) as HTMLButtonElement;
  await addRouteToBtn(homeButton, "/lobby");

  const howTobutton = document.querySelector(
    ".howTo-button"
  ) as HTMLButtonElement;
  howTobutton.addEventListener("click", () => {
    createHowToPlayPopup();
  });

  const endTurnButton = document.querySelector(
    ".endTurn-button"
  ) as HTMLButtonElement;
  endTurnButton.disabled = false;
  endTurnButton?.addEventListener("click", async () => {
    const player = document.querySelector("#playerHill");
    const playerId: number = Number(player?.getAttribute("player-id"));
    const opp = document.querySelector("#oppHill");
    const oppId: number = Number(opp?.getAttribute("player-id"));
    const gameState = await logMove();
    if (gameState.gameOver) {
      if (gameState.gameWinner === playerId) {
        showResult("win");
        socket.send("hello", [playerId, "game", gameState.gameWinner]);
        setTimeout(async () => {
          const modal = Array.from(document.querySelectorAll("#modal"));
          modal?.map((m) => m.remove());
          clearTrench();
          await showLobbyPage();
        }, 10000);
        return;
      } else {
        showResult("lose");
        socket.send("hello", [playerId, "game", gameState.gameWinner]);
        setTimeout(async () => {
          const modal = Array.from(document.querySelectorAll("#modal"));
          modal?.map((m) => m.remove());
          clearTrench();
          await showLobbyPage();
        }, 10000);
        return;
      }
    }
    const totalMoves = countCards();
    if (totalMoves >= 6) {
      const roundWinner = gameState.data.winner_id;
      if (roundWinner === playerId) {
        showResult("win");
        socket.send("hello", [playerId, "round", roundWinner]);
        setTimeout(async () => {
          clearTrench();
          await startgame(playerId, oppId);
          showOpponentsTurn();
        }, 5000);
      } else {
        showResult("lose");
        socket.send("hello", [playerId, "round", roundWinner]);
        setTimeout(async () => {
          clearTrench();
          await startgame(playerId, oppId);
          showOpponentsTurn();
        }, 5000);
      }
      return;
    } else {
      socket.send("hello", [playerId, null]);
      //   showOpponentsTurn();
      endTurnButton.disabled = true;
      return;
    }
    socket.send("hello", [playerId, null]);
    //showOpponentsTurn();
    endTurnButton.disabled = true;
  });
  setupDropZones();
}

async function getCurrentMatchId(playerId: number): Promise<number> {
  const response = await fetch("/api/currentgame", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerId }),
  });
  const result = await response.json();
  return result.data.matchId;
}
