import { Card } from './Deck';
import PlayerGUI from './PlayerGUI';

export default class DealerGUI extends PlayerGUI {

    init():void {
        super.init();

        // Hide buttons and info, but keep visual spacing of info
        this.buttonBox.setAttribute('display', 'none');
        this.infoBox.setAttribute('visibility', 'hidden');
    }

    addCard(cardData:Card):Element {
        // Hide info on first card
        let card = super.addCard(cardData);
        if (this.player.hand.length === 1) {
            card.innerHTML = '???</br>???';
        }
        return card;
    }

    clearCards():void {
        super.clearCards();
        // Hide total score
        this.infoBox.setAttribute('visibility', 'hidden');
    }

    reveal(card:Card):void {
        this.infoBox.setAttribute('visibility', 'visible');
        this.cardBox.children[0].innerHTML = card.display;
    }
}