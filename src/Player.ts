import { PlayerGUI } from './PlayerGUI';
import { DealerGUI } from './DealerGUI';
import { Game } from './Game';
import { Deck, Card } from './Deck';
import { WSClient } from './WSClient';

export class Player {

    public hand: Card[] = [];
    public score: number = 0;
    public gui: DealerGUI; // | PlayerGUI
    protected deck: Deck;
    private id: number;
    private bust: boolean = false;
    private blackjack: boolean = false;
    // protected game: Game;

    constructor(game: Game, id: number) {
        // this.game = game;
        this.deck = game.deck;
        this.id = id;
    }

    public deal(): void {
        this.score = 0;
        this.bust = false;
        this.blackjack = false;

        this.hit(this.deck.deal());
        this.hit(this.deck.deal());
    }

    public hit(card: Card): Card {
        this.hand = [...this.hand, card];
        this.score = this.score += card.value;
        this.checkScore();

        // Only Dealer has gui, see if there's a better way to do this.
        if (this.gui) {
            this.gui.addCard(card);
        }

        return card;
    }

    public discard(): Card[] {
        // Only Dealer has gui, see if there's a better way to do this.
        if (this.gui) {
            this.gui.clearCards();
        }
        // move cards from hand to discard
        const discards = this.hand.slice();
        this.hand = [];
        return discards;
    }

    private checkScore(): void {
        // Check for aces, make them worth 1 if they would push the total score over 21
        this.hand.forEach(c => {
            if ((c.value === 11) && (this.score > 21)) {
                c.value = 1;
                this.score -= 10;
            }
        });
        
        if (this.score > 20) {
            this.blackjack = true;
            if (this.score > 21) {
                this.blackjack = false;
                this.bust = true;
            }
            // this.gui.disable();
            // this.game.end();
        }
    }

    // endTurn(): void {
    //     // this.ws.endTurn(this.position);
    //     this.game.nextPlayer();
    // }
}
