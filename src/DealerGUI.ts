import { Card } from './Deck';
import PlayerGUI from './PlayerGUI';
import Player from './Player';

export default class DealerGUI extends PlayerGUI {

    addCard(cardData: Card): void {
        super.addCard(cardData);

        // Hide info on first card
        this.cardBox.children[0].innerHTML = '???</br>???';
    }

    clearCards(): void {
        super.clearCards();
        // Hide total score
        // this.infoBox.classList.add('hidden');
    }

    reveal(card: Card): void {
        this.infoBox.classList.remove('hidden');
        this.cardBox.children[0].innerHTML = card.display;
    }
}