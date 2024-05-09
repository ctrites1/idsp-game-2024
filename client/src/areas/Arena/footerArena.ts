import {Card} from "../../../database";

export class Footer {
  private playerHandContainer: HTMLElement;
  private endTurnButton: HTMLElement;
  private surrenderButton: HTMLElement;
  private logButton: HTMLElement;
  // private isPlayerTurn: boolean = true;
  private cards: Card[];

  constructor(cards: Card[]) {
    this.playerHandContainer = document.getElementById("playerHandContainer") as HTMLElement;
    this.endTurnButton = document.querySelector(".endTurn-button") as HTMLElement;
    this.surrenderButton = document.querySelector(".surrender-button") as HTMLElement;
    this.logButton = document.querySelector(".log-button") as HTMLElement;

    if (!this.playerHandContainer || !this.endTurnButton || !this.surrenderButton || !this.logButton) {
      throw new Error("One or more UI elements are missing.");
    }

    this.cards = cards;
    this.setupEventListeners();
    this.renderCards();
    // this.updateTurnIndicator();
  }

  private setupEventListeners(): void {
    this.endTurnButton.addEventListener("click", () => {
      console.log("End Turn clicked");
      // this.toggleTurn();
    });
    this.surrenderButton.addEventListener("click", () => {
      console.log("Surrender clicked");
      location.reload();
      // TODO: Logic to handle log viewing to be added here
    });
    this.logButton.addEventListener("click", () => {
      console.log("Log clicked");
      // TODO: Logic to handle log viewing to be added here
    });
  }

  private renderCards(): void {
    this.playerHandContainer.innerHTML = "";
    this.cards.forEach((card) => {
      const cardElement = document.createElement("div");
      cardElement.className = "card";
      cardElement.innerHTML = `
        <div class="card-name">${card.name} (${card.power} Power)</div>
        <div class="card-details">${card.element} - ${card.type}</div>
        <div class="card-description">${card.description}</div>
      `;
      this.playerHandContainer.appendChild(cardElement);
    });
  }

  // private updateTurnIndicator(): void {
  //   const turnIndicator = document.querySelector(".turn-indicator");
  //   if (turnIndicator) {
  //     turnIndicator.textContent = this.isPlayerTurn ? "Player's Turn" : "Opponent's Turn";
  //   }
  // }

  // private toggleTurn(): void {
  //   this.isPlayerTurn = !this.isPlayerTurn;
  //   this.updateTurnIndicator();
  // }
}

// function getRandomCards(cards: Card[], count: number): Card[] {
//   const shuffled = cards.sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, count);
// }

// document.addEventListener('DOMContentLoaded', () => {
//   const randomCards = getRandomCards(cards, 5);
//   new Footer(randomCards);
// });