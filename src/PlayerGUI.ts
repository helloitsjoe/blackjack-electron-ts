import { Card } from './Deck';
import Player from './Player';
import { e } from './utils';

export default class PlayerGUI {

    // protected score: HTMLElement;
    protected cardBox: HTMLElement;
    protected buttonBox: HTMLElement;
    protected infoBox: HTMLElement;
    protected endState: HTMLElement;
    public hitButton: HTMLElement;
    public stayButton: HTMLElement;

    constructor() {
        // this.hit = this.hit.bind(this);
        // this.endTurn = this.endTurn.bind(this);

        this.endState = document.getElementById('end-state');
        // this.endState.addEventListener('click', () => { /*game.refresh*/ }); // TODO: send 'refresh' intent to game

        this.buttonBox = document.getElementById('button-box');
        this.infoBox = document.getElementById('info-box');
        this.cardBox = document.getElementById('card-box');

        this.hitButton = document.getElementById('hit-button');
        this.stayButton = document.getElementById('stay-button');
    }

    init(): void {
        // No-op for now
    }

    addCard(cardData: Card): void {
        // this.score.innerHTML = this.player.score.toString();
        let card = e('div', 'card', null, this.cardBox);
        card.innerHTML = cardData.display;
    }

    clearCards(): void {
        this.cardBox.innerHTML = '';
    }

    // enable(): void {
    //     this.hitButton.addEventListener('click', this.hit);
    //     this.stayButton.addEventListener('click', this.endTurn);
    // }

    // disable(): void {
    //     if (this.buttonBox) {
    //         this.hitButton.removeEventListener('click', this.hit);
    //         this.stayButton.removeEventListener('click', this.endTurn);
    //     }
    // }

    // hit(): void {
    //     // this.player.hit();
    // }

    // endTurn(): void {
    //     // this.player.endTurn();
    // }
}