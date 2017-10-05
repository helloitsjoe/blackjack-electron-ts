import { Card } from './Deck';
import Player from './Player';

export default class PlayerGUI {

    protected player: Player;
    protected board: Element;
    protected cardBox: Element;
    protected buttonBox: Element;
    protected hitButton: Element;
    protected stayButton: Element;
    protected infoBox: Element;
    protected label: Element;
    protected score: Element;

    constructor(player: Player) {
        this.hit = this.hit.bind(this);
        this.endTurn = this.endTurn.bind(this);
        this.player = player;
        this.init();
    }

    init(): void {
        let position = this.player.position;
        let boardParent = position > 0 ? document.getElementById('player-list') : document.getElementById('dealer-box');;
        let infoText = position > 0 ? 'Player: ' : 'Dealer: ';

        this.board = e('div', 'player', `player-${this.player.position}`, boardParent);
        this.cardBox = e('div', null, null, this.board);
        
        this.buttonBox = e('div', 'button-box', null, this.board);
        this.hitButton = e('button', null, null, this.buttonBox, 'Hit');
        this.stayButton = e('button', null, null, this.buttonBox, 'Stay');            

        this.infoBox = e('div', 'info', null, this.board)
        this.label = e('span', null, null, this.infoBox, infoText);
        this.score = e('span', null, null, this.infoBox);
    }

    addCard(cardData: Card): Element {
        this.score.innerHTML = this.player.score.toString();
        let card = e('div', 'card', null, this.cardBox);
        card.innerHTML = cardData.toString();
        return card;
    }

    clearCards(): void {
        this.cardBox.innerHTML = '';
    }

    enable(): void {
        this.hitButton.addEventListener('click', this.hit);
        this.stayButton.addEventListener('click', this.endTurn);
    }

    disable(): void {
        if (this.buttonBox) {
            this.hitButton.removeEventListener('click', this.hit);
            this.stayButton.removeEventListener('click', this.endTurn);
        }
    }

    hit(): void {
        this.player.ws.hit(this.player.position);
        this.player.hit();
    }

    endTurn(): void {
        this.player.ws.endTurn(this.player.position);
        this.player.endTurn();
    }
}

function e(tag: string, classes?: string, id?: string, parentNode?: Element, innerHTML?: string): Element {
    const element = document.createElement(tag);
    if (classes) {
        let classArr;
        if (typeof classes === 'string') {
            classArr = classes.split(' ');
        } else {
            classArr = classes;
        }
        classArr.forEach((className) => {
            element.classList.add(className);
        });
    }
    if (id) {
        element.id = id;
    }
    if (parentNode) {
        parentNode.appendChild(element);
    }
    if (innerHTML) {
        element.innerHTML = innerHTML;
    }
    return element;
}