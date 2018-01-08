'use strict'
const { expect } = require('chai');
// const sinon = require('sinon');
// const sinonChai = require('sinon-chai');
// const baseskill = require('@jibo/baseskill');
// const { skill_test: { SkillConversation } } = require('@jibo/test-utils');
// const tu = require('./TestUtils');
// const { mockRuntimeData } = require('@jibo/test-utils');
const { Dealer, DealerGUI, Deck, Game, Player, PlayerGUI, WSClient, WSServer } = global.main;

describe('All', function () {
    
    it('testing the tests', function () {
        console.log(`global.main:`, global.main);
        const game = new Game();
        game.initDealer();
        console.log(`game:`, game);
        expect(game.dealer).to.be.ok;
    });
});