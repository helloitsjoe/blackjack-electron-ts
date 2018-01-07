import { Card } from './Deck';
import PlayerGUI from './PlayerGUI';
import Player from './Player';

export default class DealerGUI extends PlayerGUI {

    init(): void {
        // Hide buttons and info, but keep visual spacing of info
        this.buttonBox.setAttribute('display', 'none');
        this.infoBox.setAttribute('visibility', 'hidden');
    }

    addCard(cardData: Card): void {
        console.log(`dealer cardData:`, cardData);
        super.addCard(cardData);
        
        // Hide info on first card
        this.cardBox.children[0].innerHTML = '???</br>???';
    }

    clearCards(): void {
        super.clearCards();
        // Hide total score
        this.infoBox.setAttribute('visibility', 'hidden');
    }

    reveal(card: Card): void {
        this.infoBox.setAttribute('visibility', 'visible');
        this.cardBox.children[0].innerHTML = card.display;
    }
}