import DealerGUI from "./DealerGUI";
import Player from "./Player";

export default class Dealer extends Player {

    public gui:DealerGUI;
    
    // wait():void {
    //     document.getElementById('main').innerHTML =
    //     `
    //         <div class="title">
    //             <h2>BlackJack</h2>
    //         </div>
    //         <div id="dealer-box"></div>
    //     `
    // }

    dealerTurn():void {
        while (this.score < 17) {
            this.hit();
        }
        if (this.score < 21) {
            this.game.end();
        }
    }

    reveal():void {
        this.gui.reveal(this.hand[0]);
    }
}
