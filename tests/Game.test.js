'use strict'
const { expect } = require('chai');
const WebSocket = require('ws');

const { Dealer, DealerGUI, Deck, Game, Player, PlayerGUI, WSClient, WSServer } = global.main;

const HOST = 'localhost';
const FAKE_PORT = 1234;
const FULL_DECK_LENGTH = 52;

describe('Game', function () {

    it('initDealer creates wsServer, dealer, Deck', function () {
        game.initDealer(server, FAKE_PORT);
        expect(game.wsServer).to.be.instanceof(WSServer);
        expect(game.deck).to.be.instanceof(Deck);
        expect(game.dealer).to.be.instanceof(Dealer);
    });

    it('game.players is empty array', function () {
        expect(Array.isArray(game.players)).to.be.true;
        expect(game.players.length).to.equal(0);
    });

    it('totalPlayers = 1', function () {
        expect(game.totalPlayers).to.equal(1);
    });

    it('curr = 0', function () {
        expect(game.curr).to.equal(0);
    });

    describe('deal', function () {

        it('deals dealer 2 cards', function () {
            game.initDealer(server, FAKE_PORT);
            expect(game.dealer.hand.length).to.equal(0);
            game.deal();
            expect(game.dealer.hand.length).to.equal(2);
        });

        it('discards dealer cards', function () {
            game.initDealer(server, FAKE_PORT);
            game.deal();
            const firstHand = game.dealer.hand;
            game.deal();
            const secondHand = game.dealer.hand;
            expect(firstHand).to.not.equal(secondHand);
        });

        it('discards player cards', function () {
            game.initDealer(server, FAKE_PORT);
            const player = new Player(game, 1);
            game.players.push(player);
            game.deal();
            const firstHand = player.hand.slice();
            game.deal();
            const secondHand = player.hand;
            expect(firstHand).to.not.equal(secondHand);
        });

        it('deals 2 cards to each player', function () {
            game.initDealer(server, FAKE_PORT);
            game.players.push(new Player(game, 1));
            // game.initPlayer(new WebSocket(`ws://${host}));
            game.deal();
            expect(game.players[0].hand.length).to.equal(2);
        });

        it('deals different cards to each player', function () {
            game.initDealer(server, FAKE_PORT);
            game.players.push(new Player(game, 1));
            game.players.push(new Player(game, 2));
            game.deal();
            const hands = game.players.map(player => player.hand);
            expect(hands[0]).to.not.equal(hands[1]);
        });

        it('takes cards from the deck', function () {
            game.initDealer(server, FAKE_PORT);
            game.players.push(new Player(game, 1));
            game.deal();
            expect(game.deck.cards.length).to.equal(FULL_DECK_LENGTH - 4);
        });

        it('sends hands over the websocket', function () {
            
        });
    });
});