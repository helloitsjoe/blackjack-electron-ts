import PlayerGUI from './PlayerGUI';
import DealerGUI from './DealerGUI';
import Game from './Game';
import Deck, { Card } from './Deck';
import WSClient from './WSClient';

export default class Player {

    public hand: Card[];
    public score: number = 0;
    public gui: DealerGUI; // | PlayerGUI
    private id: number;
    private deck: Deck;
    private bust: boolean = false;
    private blackjack: boolean = false;
    // protected game: Game;

    constructor(game: Game, id: number) {
        // this.game = game;
        this.deck = game.deck;
        this.id = id;

        this.hand = [];
    }

    deal(): void {
        // move cards from hand to discard
        // Maybe move this to a `discard` method, called by game.deal()?
        this.deck.discards = [...this.deck.discards, ...this.hand];
        this.hand.length = 0;

        // Only Dealer has gui, see if there's a better way to do this.
        if (this.gui) {
            this.gui.clearCards();
        }

        this.score = 0;
        this.bust = false;
        this.blackjack = false;

        this.hit(2);
    }

    hit(times: number = 1): Card {
        if (!this.deck.cards.length) {
            this.deck.shuffle();
        }

        let card = this.deck.cards.pop();
        this.hand.push(card);

        // Check for aces, make them worth 1 if they would push the total score over 21
        this.hand.forEach((c) => {
            if (c.value === 11 && (this.score + c.value > 21)) {
                c.value = 1;
            }
        })

        this.score += card.value;

        // Only Dealer has gui, see if there's a better way to do this.
        if (this.gui) {
            this.gui.addCard(card);
        }

        if (this.score > 20) {
            this.blackjack = true;
            if (this.score > 21) {
                this.blackjack = false;
                this.bust = true;
            }
            // this.gui.disable();
            // this.game.end();
        }
        if (times > 1) {
            return this.hit(times - 1);
        }
        return card;
    }

    // endTurn(): void {
    //     // this.ws.endTurn(this.position);
    //     this.game.nextPlayer();
    // }
}
