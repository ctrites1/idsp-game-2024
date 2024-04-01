# idsp-game-2024

## Tentative Tech Stack

- SQL database either MySQL or Postgres
- Node express server with Typescript
- front end code written in Typescript and bundled with parcel
- tailwind CSS

## TDD Modules

### Creating Deck - Christy

This TDD module is designed to generate a balanced deck that has exactly 1 random hero card and 9 other random non-hero cards for the card game we will be creating in the IDSP project. I have also created a fake cards database for the function to work with each card having a name, element, power, cardClass, and effects. Tests were created to ensure that generated decks will have exactly 1 hero card and will return a different set of deck in each call.

### Checking if card has defense points - Kyle

The TDD module was developed to test the function that could be used to validate a defense card when it is played in response to some attack by an opponent. I used some of the cards from Christy's card "database" array to check their values and types against other cards that could be played in a round. Test ensures that only defense cards can be used to defend, only attack cards can be used to attack, and playing a defense card cannot result in negative attack points.

### Calculating points - Ademi

The main focus of this TDD module is to calculate points. I used some fake cards to test and make sure that the scoring works right, especially when someone plays a 'Hero' card. These tests help check that the correct scores are given and that the 'Hero' cards really do give players an advantage, just like they're supposed to in the game.

### () - Christine
