function calculateScore(deck) {
    return deck.reduce((total, card) => {
        let scoreModifier = 1;
        if (card.cardClass === 'Hero') {
            scoreModifier = 2; 
        }
        return total + (card.power * scoreModifier);
    }, 0);
}

module.exports = calculateScore;

