const cards = [
    {
        name: 'Fire Warrior',
        element: 'Fire',
        power: 5,
        cardClass: 'Melee',
        effects: 'None'
    },
    {
        name: 'Fire Mage',
        element: 'Fire',
        power: 3,
        cardClass: 'Mage',
        effects: 'Burn'
    },
    {
        name: 'Fire Support',
        element: 'Fire',
        power: 2,
        cardClass: 'Support',
        effects: 'Buff'
    },
    {
        name: 'Fire Melee 0',
        element: 'Fire',
        power: 6,
        cardClass: 'Melee',
        effects: 'Strike'
    },
    {
        name: 'Water Mage 1',
        element: 'Water',
        power: 4,
        cardClass: 'Mage',
        effects: 'Freeze'
    },
    {
        name: 'Ice Support 2',
        element: 'Ice',
        power: 4,
        cardClass: 'Support',
        effects: 'Revive'
    },
    {
        name: 'Earth Hero 3',
        element: 'Earth',
        power: 2,
        cardClass: 'Hero',
        effects: 'Ultimate Strike'
    },
    {
        name: 'Wind Melee 4',
        element: 'Wind',
        power: 4,
        cardClass: 'Melee',
        effects: 'Double Hit'
    },
    {
        name: 'Fire Mage 5',
        element: 'Fire',
        power: 5,
        cardClass: 'Mage',
        effects: 'Heal'
    },
    {
        name: 'Water Support 6',
        element: 'Water',
        power: 5,
        cardClass: 'Support',
        effects: 'Shield'
    },
    {
        name: 'Ice Hero 7',
        element: 'Ice',
        power: 1,
        cardClass: 'Hero',
        effects: 'Mass Heal'
    },
    {
        name: 'Earth Melee 8',
        element: 'Earth',
        power: 3,
        cardClass: 'Melee',
        effects: 'Double Hit'
    },
    {
        name: 'Wind Mage 9',
        element: 'Wind',
        power: 6,
        cardClass: 'Mage',
        effects: 'Burn'
    },
    {
        name: 'Fire Support 10',
        element: 'Fire',
        power: 1,
        cardClass: 'Support',
        effects: 'Revive'
    },
    {
        name: 'Water Hero 11',
        element: 'Water',
        power: 4,
        cardClass: 'Hero',
        effects: 'Ultimate Strike'
    },
    {
        name: 'Ice Melee 12',
        element: 'Ice',
        power: 5,
        cardClass: 'Melee',
        effects: 'Strike'
    },
    {
        name: 'Earth Mage 13',
        element: 'Earth',
        power: 2,
        cardClass: 'Mage',
        effects: 'Shock'
    },
    {
        name: 'Wind Support 14',
        element: 'Wind',
        power: 5,
        cardClass: 'Support',
        effects: 'Shield'
    },
    {
        name: 'Fire Hero 15',
        element: 'Fire',
        power: 5,
        cardClass: 'Hero',
        effects: 'Ultimate Strike'
    },
    {
        name: 'Water Melee 16',
        element: 'Water',
        power: 4,
        cardClass: 'Melee',
        effects: 'Double Hit'
    },
    {
        name: 'Ice Mage 17',
        element: 'Ice',
        power: 2,
        cardClass: 'Mage',
        effects: 'Shock'
    },
    {
        name: 'Earth Support 18',
        element: 'Earth',
        power: 5,
        cardClass: 'Support',
        effects: 'Debuff'
    },
    {
        name: 'Wind Hero 19',
        element: 'Wind',
        power: 5,
        cardClass: 'Hero',
        effects: 'Ultimate Strike'
    }
]

// Creating a deck that has exactly 1 random hero card and 9 other random non-hero cards. 
function createDeck() {
    const deck = [];
    const heroCards = cards.filter(card => card.cardClass === 'Hero');
    const nonHeroCards = cards.filter(card => card.cardClass !== 'Hero');

    // Adding 9 random non-Hero cards
    for (let i = 0; i < 9; i++) {
        const randomIndex = Math.floor(Math.random() * nonHeroCards.length);
        deck.push(...nonHeroCards.splice(randomIndex, 1));
    }

    // Adding exactly one Hero card
    const randomHeroIndex = Math.floor(Math.random() * heroCards.length);
    deck.push(heroCards[randomHeroIndex]);

    return deck;
}

module.exports = {createDeck};
