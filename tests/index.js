const main = require('../index');
global.main = main;

describe('Blackjack', () => {
    require('./Blackjack.test');
});
