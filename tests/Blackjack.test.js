'use strict'
const { expect } = require('chai');
const { Dealer, DealerGUI, Deck, Game, Player, PlayerGUI, WSClient, WSServer } = global.main;
console.log(`global.main:`, global.main);

describe('All', function () {
    
    it('testing the tests', function () {
        const game = new Game();
        game.initDealer();
        console.log(`game:`, game);
        expect(game.dealer).to.be.ok;
    });
});