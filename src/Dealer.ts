import { DealerGUI } from "./DealerGUI";
import { Player } from "./Player";
import { Game } from './Game';

export class Dealer extends Player {

    public gui: DealerGUI;

    constructor(game: Game, position: number) {
        super(game, position);

        this.gui = new DealerGUI();
        this.gui.init();
    }

    dealerTurn(): void {
        while (this.score < 17) {
            this.hit();
        }
        // Why this if?
        if (this.score < 21) {
            this.reveal();
            // this.game.end();
        }
    }

    reveal(): void {
        this.gui.reveal(this.hand[0]);
    }
}
