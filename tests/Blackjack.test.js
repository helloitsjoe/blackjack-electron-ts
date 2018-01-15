'use strict'
const { expect } = require('chai');
const WebSocket = require('ws');

const { Dealer, DealerGUI, Deck, Game, Player, PlayerGUI, WSClient, WSServer } = global.main;

const HOST = 'localhost';
const FAKE_PORT = 1234;
const FULL_DECK_LENGTH = 52;

const findCardByValue = (deck, value) => deck.cards.find(card => card.value === value);

describe('All', function () {

    let server = null;
    let game = null;
    let deck = null;

    beforeEach(() => {
        server = new WebSocket.Server({ port: FAKE_PORT });
    });

    afterEach(() => {
        server.close();
    });

    describe('Game', function () {

        beforeEach(() => {
            game = new Game();
        });

        afterEach(() => {
            game = null;
        });

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

    describe('Deck', function () {

        const expectedValues = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
        const expectedFaces = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];

        beforeEach(() => {
            deck = new Deck();
        });

        afterEach(() => {
            deck = null;
        });

        it('init deals a full deck', function () {
            deck.init(1);
            const suits = [[], [], [], []];
            deck.cards.forEach(card => {
                expect(card.display, 'display').to.be.ok;
                expect(card.value, 'value').to.be.ok;
                expect(card.face, 'face').to.be.ok;
                suits[card.suit].push(card);
            });
            suits.forEach(suit => {
                const values = suit.map(card => card.value);
                const faces = suit.map(card => card.face);
                expect(values, 'values').to.deep.equal(expectedValues);
                expect(faces, 'faces').to.deep.equal(expectedFaces);
                expect(suit.length, 'suit length').to.equal(FULL_DECK_LENGTH / suits.length);
            });
            expect(deck.discards.length, 'discards').to.equal(0);
        });

        it('init deals multiple decks', function () {
            deck.init(2);
            expect(deck.cards.length).to.equal(FULL_DECK_LENGTH * 2);
        });

        it('shuffle randomizes deck', function () {
            deck.init(1);
            const preShuffleCards = [...deck.cards];
            deck.shuffle();
            expect(deck.cards.length).to.equal(preShuffleCards.length);
            expect(deck.cards).to.not.deep.equal(preShuffleCards);
        });

        it('shuffle replaces deck with discards', function () {
            deck.init(1);
            while (deck.cards.length) {
                deck.discards = [...deck.discards, deck.deal()];
            }
            expect(deck.cards.length, 'pre-shuffle cards').to.equal(0);
            expect(deck.discards.length, 'pre-shuffle discards').to.equal(FULL_DECK_LENGTH);
            deck.shuffle();
            expect(deck.cards.length, 'shuffled cards').to.equal(FULL_DECK_LENGTH);
            expect(deck.discards.length, 'shuffled discards').to.equal(0);
        });

        it('deal removes a card from the deck', function () {
            deck.init(1);
            const expected = deck.cards.slice(-1);
            const card = deck.deal();
            expect(card).to.deep.equal(...expected);
            expect(deck.cards.length).to.equal(FULL_DECK_LENGTH - 1);
        });

        it('deal shuffles at end of deck', function () {
            deck.init(1);
            const origCards = [...deck.cards];

            // Move all cards into discards
            while (deck.cards.length) {
                deck.discards = [...deck.discards, deck.deal()];
            }
            deck.deal();
            const shuffledCardsOneDealt = [...deck.cards];
            const origCardsOneDealt = origCards.slice(0, -1);
            expect(shuffledCardsOneDealt.length).to.equal(origCardsOneDealt.length);
            expect(shuffledCardsOneDealt).to.not.deep.equal(origCardsOneDealt);
        });
    });

    describe('Player', function () {

        let game = null;
        let player = null;

        beforeEach(() => {
            game = new Game();
            game.initDealer(server, FAKE_PORT);
            player = new Player(game, 1);
            game.players.push(player);
        });

        afterEach(() => {
            game = null;
            player = null;
        });

        it('does not create new deck for each player', function () {
            const gameDeck = game.deck;
            const playerDeck = player.deck;
            expect(gameDeck, 'before deal').to.deep.equal(playerDeck);
            game.deal();
            expect(gameDeck, 'after deal').to.deep.equal(playerDeck);
        });

        it('deal deals two cards', function () {
            const newCards = game.deck.cards.slice(-2).reverse();
            expect(player.hand, 'before').to.deep.equal([]);
            player.deal();
            expect(player.hand, 'after').to.deep.equal(newCards);
        });

        it('deal sets score: 0, blackjack: false, bust:false', function () {
            player = Object.assign(player, { score: 1000, blackjack: true, bust: true });
            const twoCards = game.deck.cards.slice(-2);
            const newScore = twoCards.reduce((sum, card) => sum += card.value, 0);
            player.deal();
            expect(player.score, 'score').to.equal(newScore);
            expect(player.blackjack, 'blackjack').to.be.false;
            expect(player.bust, 'bust').to.be.false;
        });

        it('hit moves a card from deck to player hand', function () {
            expect(game.deck.cards.length).to.equal(FULL_DECK_LENGTH);
            const hitCard = game.deck.cards.slice(-1);
            player.hit(game.deck.deal());
            expect(game.deck.cards.length).to.equal(FULL_DECK_LENGTH - 1);
            expect(player.hand).to.deep.equal(hitCard);
        });

        it('hit updates score', function () {
            const hitCard = game.deck.cards.slice(-1);
            player.hit(game.deck.deal());
            expect(player.score).to.equal(hitCard[0].value);
        });

        it('discard moves hand cards to deck.discards', function () {
            game.deal();
            const playerHand = player.hand.slice();
            expect(playerHand.length, 'playerHand length').to.equal(2);
            expect(game.deck.discards.length, 'pre-discard discards length').to.equal(0);
            game.deck.discards = player.discard();
            expect(player.hand.length, 'hand after discard').to.equal(0);
            expect(game.deck.discards.length, 'discards length').to.equal(2);
            expect(playerHand).to.deep.equal(game.deck.discards);
        });

        it('if hit makes score > 21, Ace value in hand changes from 11 to 1', function () {
            player.hit(findCardByValue(game.deck, 11));
            player.hit(findCardByValue(game.deck, 10));
            expect(player.hand[0].value, 'ace before').to.equal(11);
            expect(player.score, 'score before').to.equal(21);
            player.hit(findCardByValue(game.deck, 8));
            expect(player.hand[0].value, 'ace after').to.equal(1);
            expect(player.score, 'score after').to.equal(19);
        });

        it('if ace hit makes score > 21, hit card value changes from 11 to 1', function () {
            player.hit(findCardByValue(game.deck, 8));
            player.hit(findCardByValue(game.deck, 10));
            expect(player.score, 'score before').to.equal(18);
            player.hit(findCardByValue(game.deck, 11));
            expect(player.hand[2].value, 'ace after').to.equal(1);
            expect(player.score, 'score after').to.equal(19);
        });

        it('sets blackjack true if score is 21', function () {
            expect(player.blackjack).to.be.false;
            player.hit(findCardByValue(game.deck, 11));
            player.hit(findCardByValue(game.deck, 10));
            expect(player.blackjack).to.be.true;
        });

        it('sets bust true if score is > 21', function () {
            expect(player.bust).to.be.false;
            player.hit(findCardByValue(game.deck, 10));
            player.hit(findCardByValue(game.deck, 9));
            player.hit(findCardByValue(game.deck, 8));
            expect(player.bust).to.be.true;
        });
    });

    describe('Dealer', function () {
        
    });
});