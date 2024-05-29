
   
   
   export function createHowToPlayPopup() {
        const popup = document.createElement('div');
        popup.classList.add('popup');
    
        const popupContent = document.createElement('div');
        popupContent.classList.add('popup-content');
    
        // const heading = document.createElement('h2');
        // heading.textContent = 'How to play';
        // popupContent.appendChild(heading);
    
        // const instructions = document.createElement('div');
        // instructions.classList.add('instructions');
        // const instructionsText = document.createElement('p');
        // instructionsText.textContent = 'The score for each match is the suit points multiplied by the number of tiles remaining on the board.';
        // instructions.appendChild(instructionsText);
    
        // // Create and add the scoring section
        // const scoring = document.createElement('div');
        // scoring.classList.add('scoring');
        // const scoringHeading = document.createElement('h3');
        // scoringHeading.textContent = 'Scoring';
        // scoring.appendChild(scoringHeading);
    
        // const suitPoints = document.createElement('div');
        // suitPoints.classList.add('suit-points');
        // const suits = [
        //     { name: 'Wan 2 points', imgSrc: 'wan.png' },
        //     { name: 'Circle 4 points', imgSrc: 'circle.png' },
        //     { name: 'Bamboo 6 points', imgSrc: 'bamboo.png' }
        // ];
    
        // suits.forEach(suit => {
        //     const suitDiv = document.createElement('div');
        //     suitDiv.classList.add('suit');
        //     const suitHeading = document.createElement('h4');
        //     suitHeading.textContent = suit.name;
        //     const suitImg = document.createElement('img');
        //     suitImg.src = suit.imgSrc;
        //     suitImg.alt = `${suit.name} Tiles`;
        //     suitDiv.appendChild(suitHeading);
        //     suitDiv.appendChild(suitImg);
        //     suitPoints.appendChild(suitDiv);
        // });
    
        // scoring.appendChild(suitPoints);
    
        // // Special points section
        // const specialPoints = document.createElement('div');
        // specialPoints.classList.add('special-points');
        // const specials = [
        //     { name: 'Wind 8 points', imgSrc: 'wind.png' },
        //     { name: 'Dragon 10 points', imgSrc: 'dragon.png' },
        //     { name: 'Flower 12 points', imgSrc: 'flower.png' },
        //     { name: 'Season 14 points', imgSrc: 'season.png' }
        // ];
    
        // specials.forEach(special => {
        //     const specialDiv = document.createElement('div');
        //     specialDiv.classList.add('special');
        //     const specialHeading = document.createElement('h4');
        //     specialHeading.textContent = special.name;
        //     const specialImg = document.createElement('img');
        //     specialImg.src = special.imgSrc;
        //     specialImg.alt = `${special.name} Tiles`;
        //     specialDiv.appendChild(specialHeading);
        //     specialDiv.appendChild(specialImg);
        //     specialPoints.appendChild(specialDiv);
        // });
    
        // scoring.appendChild(specialPoints);
        // instructions.appendChild(scoring);
        // popupContent.appendChild(instructions);
    
        // Create and add the continue button
        // const continueBtn = document.createElement('button');
        // continueBtn.classList.add('continue-btn');
        // continueBtn.textContent = 'Continue';
        // continueBtn.addEventListener('click', () => {
        //     document.body.removeChild(popup);
        // });
    
        //popupContent.appendChild(continueBtn);
        //popup.appendChild(popupContent);
    
        document.body.appendChild(popup);

        const imgPopup = document.createElement('img');

        imgPopup.src = `../../../public/assets/update/Button.svg`

        popup.appendChild(imgPopup);
    }
    
    // Call the function to create the popup
    createHowToPlayPopup();
    
    // const body = document.querySelector("body") as HTMLBodyElement;
    // const modal = document.createElement("div");
    // modal.className = "howTo";
    // modal.id = "howTo";
  
    // const modalContent = document.createElement("div");
    // modalContent.className = "howTo-content";
  
    // const modalText = document.createElement("p");
    // modalText.id = "howTo-text";
    // modalText.textContent = "How to Play";
  
    // modalContent.appendChild(modalText);
    // modal.appendChild(modalContent);
    // body.appendChild(modal);
  
    // modal.style.display = "block";
  
    // window.addEventListener("click", (event) => {
    //   if (event.target === modal) {
    //     modal.style.display = "none";
    //     body.removeChild(modal);
    //   }
    // });
