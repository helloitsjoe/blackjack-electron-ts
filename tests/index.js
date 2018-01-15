require('./mockDOM');

const main = require('../index');
// const WebSocket = require('ws');
global.main = main;

// const FAKE_PORT = 1234;

describe('Blackjack', () => {

    // let server = null;
    // let game = null;
    // let deck = null;

    // beforeEach(() => {
    //     server = new WebSocket.Server({ port: FAKE_PORT });
    // });

    // afterEach(() => {
    //     server.close();
    // });

    // require('./Game.test');
    // require('./Deck.test');
    // require('./Player.test');
    require('./Blackjack.test');
});
