require('./mockDOM');

const main = require('../index.node');
global.main = main;

describe('Blackjack', () => {

    require('./Game.test');
    require('./Deck.test');
    require('./Player.test');
});
