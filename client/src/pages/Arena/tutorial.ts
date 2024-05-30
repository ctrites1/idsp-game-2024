
   
   
   export function createHowToPlayPopup() {
        const popup = document.createElement('div');
        popup.classList.add('popup');
    
        const popupContent = document.createElement('div');
        popupContent.classList.add('popup-content');
    
        const heading = document.createElement('h2');
        heading.textContent = 'How to play';
        popupContent.appendChild(heading);

        // const instructions = document.createElement('div');
        // instructions.classList.add('instructions');
        // const instructionsText = document.createElement('p');
        // instructionsText.textContent = 'The score for each match is the suit points multiplied by the number of tiles remaining on the board.';
        // instructions.appendChild(instructionsText);

        const popupText = document.createElement('div');
        popupText.classList.add("popup-text");

        popupText.innerHTML = `
    <p><strong>Objective:</strong><br>Win 2 out of 3 rounds by having a higher sum of card values than your opponent.</p>
    <p><strong>Setup:</strong><br>1. Each player chooses an element: Fire, Ice, or Water.<br>2. Shuffle the deck and deal 7 cards to each player.</p>
    <p><strong>Gameplay:</strong></p>
        <p><strong>Rounds 1 and 2:</strong>
                <br>Each round has 3 turns.<br>On each turn, player has to click "End turn" button.<br>After 3 turns, the player with the highest total value wins the round.
        <p/>                
        <p><strong>Round 3:</strong><br>Only 1 turn.<br>The player with the higher card value wins the round.</p>
    <p>Enjoy the game!</p>
`;
    
        popupContent.appendChild(popupText);

        const continueBtn = document.createElement('button');
        continueBtn.classList.add('continue-btn');
        continueBtn.textContent = 'Continue';
        continueBtn.addEventListener('click', () => {
            document.body.removeChild(popup);
        });
    
        popupContent.appendChild(continueBtn);
        popup.appendChild(popupContent);
    
        document.body.appendChild(popup);

        const imgPopup = document.createElement('img');

        popup.appendChild(imgPopup);
    }