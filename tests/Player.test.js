'use strict'
const { expect } = require('chai');
const WebSocket = require('ws');

const { Dealer, Deck, Game, Player } = global.main;

const FAKE_PORT = 1234;
const FULL_DECK_LENGTH = 52;

const findCardByValue = (deck, value) => deck.cards.find(card => card.value === value);

describe('Player', function () {
    
    let server = null;
    let game = null;
    let player = null;

    beforeEach(() => {
        server = new WebSocket.Server({ port: FAKE_PORT });
        game = new Game();
        game.init(server, FAKE_PORT);
        player = new Player(game, 1);
        game.players.push(player);
    });

    afterEach(() => {
        game = null;
        player = null;
        server.close();
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