const main = require('../index.js');
global.main = main;

describe('Blackjack', () => {
    require('./Blackjack.test');
});
