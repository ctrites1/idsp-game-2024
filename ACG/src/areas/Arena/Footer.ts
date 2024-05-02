interface Card {
    id: number;
    name: string;
    description: string;
    power: number;
    element: string;
    type: string;
  }
  
  class Footer {
    private playerHandContainer: HTMLElement;
    private endTurnButton: HTMLElement;
    private surrenderButton: HTMLElement;
    private logButton: HTMLElement;
    private cards: Card[];
  
    constructor(cards: Card[]) {
      this.playerHandContainer = document.getElementById('playerHandContainer') as HTMLElement;
      this.endTurnButton = document.querySelector('.endTurn-button') as HTMLElement;
      this.surrenderButton = document.querySelector('.surrender-button') as HTMLElement;
      this.logButton = document.querySelector('.log-button') as HTMLElement;
      this.cards = cards;
      this.setupEventListeners();
      this.renderCards();
    }
  
    // TODO: Logic for actual usages still needs to be implemented
    private setupEventListeners(): void {
      // this should trigger end of turn for the opponent player to play their turn, updates turn counter
      this.endTurnButton.addEventListener('click', () => console.log('End Turn clicked'));
      // this should trigger surrender to end the game completely, goes into winning condition (victory or defeat)
      this.surrenderButton.addEventListener('click', () => console.log('Surrender clicked'));
      // this should show the most updated game log with time stamp, a return button should also be available
      this.logButton.addEventListener('click', () => console.log('Log clicked'));
    }
  
    private renderCards(): void {
      this.playerHandContainer.innerHTML = "";
      this.cards.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.className = "card";

        // TODO: Temperary card elements until we have database setup
        cardElement.innerHTML = `
          <div class="card-name">${card.name} (${card.power} Power)</div>
          <div class="card-details">${card.element} - ${card.type}</div>
          <div class="card-description">${card.description}</div>
        `;
        this.playerHandContainer.appendChild(cardElement);
      });
    }
  }
  
  // TODO: Logic to choose cards randomly from deck
  // TODO: Logic to click each card and show a single card view