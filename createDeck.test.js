const { createDeck } = require('./createDeck.js');

describe('createDeck function', () => {
  test('should return an array of 10 cards', () => {
    const deck = createDeck();
    expect(deck).toHaveLength(10);
  });

  test('should contain exactly 1 Hero card', () => {
    const deck = createDeck();
    const heroCards = deck.filter(card => card.cardClass === 'Hero');
    expect(heroCards).toHaveLength(1);
  });

  test('should return a different deck on each call', () => {
    const deck1 = createDeck();
    const deck2 = createDeck();
    const isDifferent = deck1.some(card1 => !deck2.some(card2 => card2.name === card1.name));
    expect(isDifferent).toBeTruthy();
  });
});
