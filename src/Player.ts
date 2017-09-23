import PlayerGUI from './PlayerGUI';
import DealerGUI from './DealerGUI';
import Game from './Game';
import Deck, { Card } from './Deck';

export default class Player {

    private deck:Deck;
    public hand:Card[];
    public score:number = 0;
    private bust:boolean = false;
    private blackjack:boolean = false;
    protected game:Game;
    public gui:PlayerGUI|DealerGUI;
    public position:number;

    constructor(game:Game, position:number, deck:Deck) {
        this.game = game;
        this.deck = deck;
        this.position = position;

        this.hand = [];

        this.gui = position > 0 ? new PlayerGUI(this) : new DealerGUI(this);
    }

    deal():void {
        // move cards from hand to discard
        this.deck.discards = this.deck.discards.concat(this.hand);
        this.hand.length = 0;

        // clear card data
        this.gui.clearCards();
        this.score = 0;
        this.bust = false;
        this.blackjack = false;

        this.hit(2);
    }

    hit(times:number = 1):void {
        if (!this.deck.cards.length) {
            this.deck.shuffle();
        }

        let card = this.deck.cards.pop();
        this.hand.push(card);

        // Check for aces, make them worth 1 if they would
        // push the total score over 21
        this.hand.forEach((c) => {
            if (c.value === 11 && this.score + c.value > 21) {
                c.value = 1;
            }
        })

        this.score += card.value;
        this.gui.addCard(card);

        if (this.score > 21) {
            this.bust = true;
            this.gui.disable();
            this.game.end();
        } else if (this.score === 21) {
            this.blackjack = true;
            this.gui.disable();
            this.game.end();
        }
        if (times > 1) {
            return this.hit(times -1);
        }
    }

    endTurn():void {
        this.game.nextPlayer();
    }
}