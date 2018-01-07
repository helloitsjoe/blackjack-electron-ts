import DealerGUI from "./DealerGUI";
import Player from "./Player";
import Game from './Game';

export default class Dealer extends Player {

    public gui: DealerGUI;

    constructor(game: Game, ws: WebSocket, position: number) {
        super(game, ws, position);

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
