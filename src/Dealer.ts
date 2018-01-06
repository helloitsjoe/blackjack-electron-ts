import DealerGUI from "./DealerGUI";
import Player from "./Player";

export default class Dealer extends Player {

    public gui: DealerGUI;

    dealerTurn(): void {
        while (this.score < 17) {
            this.hit();
        }
        // Why this if?
        if (this.score < 21) {
            this.reveal();
            this.game.end();
        }
    }

    reveal(): void {
        this.gui.reveal(this.hand[0]);
    }
}
