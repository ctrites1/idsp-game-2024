const calculateScore = require("./calculateScore");

describe('calculateScore', () => {
    test('returns 0 if no cards are provided', () => {
        expect(calculateScore([])).toBe(0);
    });

    test('returns 0 if the total power of cards is 0', () => {
        const sampleCards = [
            { name: 'Weak Hero', element: 'Fire', power: 0, cardClass: 'Hero', effects: 'None' },
            { name: 'Weak Mage', element: 'Water', power: 0, cardClass: 'Mage', effects: 'None' }
        ];
        expect(calculateScore(sampleCards)).toBe(0);
    });

    test('calculates total power correctly, doubling Hero class cards', () => {
        const sampleCards = [
            { name: 'Test Hero', element: 'Fire', power: 5, cardClass: 'Hero', effects: 'Shock' },
            { name: 'Test Mage', element: 'Water', power: 3, cardClass: 'Mage', effects: 'UltimateStrike' }
        ];
        expect(calculateScore(sampleCards)).toBe(13); 
    });
});

