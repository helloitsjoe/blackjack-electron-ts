'use strict'
const { expect } = require('chai');
const WebSocket = require('ws');

const { Dealer, Deck, Game, Player, WSServer, WSClient } = global.main;

const HOST = 'localhost';
const FAKE_PORT = 1234;
const FULL_DECK_LENGTH = 52;

describe('Game', function () {

    let server = null;
    let game = null;
    let wsServer = null;

    before(() => {
        server = new WebSocket.Server({ port: FAKE_PORT });
        game = new Game();
    });

    afterEach(() => {
        game.close();
    });

    after(() => {
        game = null;
        server.close();
    })

    it('init creates wsServer, dealer, Deck', function () {
        game.init(server);
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

    describe('WebSocket client/server', function () {

        it('create new Player on connection', function (done) {
            game.init(server);
            expect(game.players.length).to.equal(0);
            const client = game.initPlayer(new WebSocket(`ws://${HOST}:${FAKE_PORT}`));
            client.ws.on('open', () => {
                expect(game.players.length).to.equal(1);
                expect(game.totalPlayers).to.equal(2);
                expect(game.players[0]).to.be.instanceof(Player);
                done();
            });
        });

        it('remove Player on disconnect', function (done) {
            game.init(server);
            expect(game.players.length).to.equal(0);
            const client = game.initPlayer(new WebSocket(`ws://${HOST}:${FAKE_PORT}`));
            client.ws.on('open', () => {
                game.wsServer.connections[0].close();
                client.ws.on('close', () => {
                    expect(game.totalPlayers).to.equal(1);
                    expect(game.players.length).to.equal(0);
                    done();
                });
            });
        });

        it('Each player gets unique ID', function (done) {
            game.init(server);
            expect(game.players.length).to.equal(0);
            const client1 = game.initPlayer(new WebSocket(`ws://${HOST}:${FAKE_PORT}`));
            const client2 = game.initPlayer(new WebSocket(`ws://${HOST}:${FAKE_PORT}`));
            let openClients = 0;
            const incrementOpenClients = () => openClients++;
            client1.ws.on('open', incrementOpenClients);
            client2.ws.on('open', incrementOpenClients);
            let interval = setInterval(() => {
                if (openClients === 2) {
                    clearInterval(interval);
                    expect(client1.id).to.not.equal(client2.id);
                    done();
                }
            }, 10);
        });

        it('Each player gets unique ID', function (done) {
            game.init(server);
            expect(game.players.length).to.equal(0);
            let openClients = 0;
            const incrementOpenClients = () => openClients++;
            const client1 = game.initPlayer(new WebSocket(`ws://${HOST}:${FAKE_PORT}`));
            const client2 = game.initPlayer(new WebSocket(`ws://${HOST}:${FAKE_PORT}`));
            client1.ws.on('open', incrementOpenClients);
            client2.ws.on('open', incrementOpenClients);
            let interval = setInterval(() => {
                if (openClients === 2) {
                    clearInterval(interval);
                    expect(client1.id).to.not.equal(client2.id);
                    done();
                }
            }, 10);
        });
    });

    describe('deal', function () {

        it('deals dealer 2 cards', function () {
            game.init(server, FAKE_PORT);
            expect(game.dealer.hand.length).to.equal(0);
            game.deal();
            expect(game.dealer.hand.length).to.equal(2);
        });

        it('discards dealer cards', function () {
            game.init(server, FAKE_PORT);
            game.deal();
            const firstHand = game.dealer.hand;
            game.deal();
            const secondHand = game.dealer.hand;
            expect(firstHand).to.not.equal(secondHand);
        });

        it('discards player cards', function () {
            game.init(server, FAKE_PORT);
            const player = new Player(game, 1);
            game.players.push(player);
            game.deal();
            const firstHand = player.hand.slice();
            game.deal();
            const secondHand = player.hand;
            expect(firstHand).to.not.equal(secondHand);
        });

        it('deals 2 cards to each player', function () {
            game.init(server, FAKE_PORT);
            game.players.push(new Player(game, 1));
            // game.initPlayer(new WebSocket(`ws://${host}));
            game.deal();
            expect(game.players[0].hand.length).to.equal(2);
        });

        it('deals different cards to each player', function () {
            game.init(server, FAKE_PORT);
            game.players.push(new Player(game, 1));
            game.players.push(new Player(game, 2));
            game.deal();
            const hands = game.players.map(player => player.hand);
            expect(hands[0]).to.not.equal(hands[1]);
        });

        it('takes cards from the deck', function () {
            game.init(server, FAKE_PORT);
            game.players.push(new Player(game, 1));
            game.deal();
            expect(game.deck.cards.length).to.equal(FULL_DECK_LENGTH - 4);
        });

        it('sends hands over the websocket', function () {
            
        });
    });
});