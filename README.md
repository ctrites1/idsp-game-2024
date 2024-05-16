# ACG | IDSP-game-2024

## Tentative Tech Stack

- mySQL database (no ORM)
- Node express server with Typescript
- Front-end, Typescript
- CSS

## TDD Modules

### Creating Deck - Christy

This TDD module is designed to generate a balanced deck that has exactly 1 random hero card and 9 other random non-hero cards for the card game we will be creating in the IDSP project. I have also created a fake cards database for the function to work with each card having a name, element, power, cardClass, and effects. Tests were created to ensure that generated decks will have exactly 1 hero card and will return a different set of deck in each call.

### Checking if card has defense points - Kyle

The TDD module was developed to test the function that could be used to validate a defense card when it is played in response to some attack by an opponent. I used some of the cards from Christy's card "database" array to check their values and types against other cards that could be played in a round. Test ensures that only defense cards can be used to defend, only attack cards can be used to attack, and playing a defense card cannot result in negative attack points.

### Calculating points - Ademi

The main focus of this TDD module is to calculate points. I used some fake cards to test and make sure that the scoring works right, especially when someone plays a 'Hero' card. These tests help check that the correct scores are given and that the 'Hero' cards really do give players an advantage, just like they're supposed to in the game.

### Calculating Card Combat Outcome - Christine

This TDD module determined the winner of a _combat_ between two cards. There are 3 possible outcomes to a combat: a card is declared a winner,
a draw or a tie. For a draw, neither card is 'killed'. For a tie, both cards are 'killed'. Cards were created in a fake database and tested to see if the correct outcomes were reached. Cards have a _health_ and _power_ stat each, and if the power of a card was equal to or greater than the health of the other card, then that card would 'kill' or defeat the second card. Typescript was used to ensure parameters and results were correctly typed.

## Game Guide ver. 0.01

- 10 cards per deck
- 5 cards per hand
- No deck choosing
- 1 Lane
- 1 Trench
- Trench holds max 3 cards
- 1 card per turn
- Player chooses colour (i.e. Red, Blue), 1 colour always goes first
- Blue always goes first
- No elements
- No support, weapon cards
- It's basically war.
