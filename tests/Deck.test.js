'use strict'
const { expect } = require('chai');
const WebSocket = require('ws');

const { Dealer, DealerGUI, Deck, Game, Player, PlayerGUI, WSClient, WSServer } = global.main;

const HOST = 'localhost';
const FAKE_PORT = 1234;
const FULL_DECK_LENGTH = 52;

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