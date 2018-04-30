import { PlayerGUI } from './PlayerGUI';
import { Message, MessageType } from './WSServer';
import * as WebSocket from 'ws';

export class WSClient {

    public players: any;
    private id: number;
    private gui: PlayerGUI;
    // private game: Game;

    constructor(private ws: WebSocket/*, game: Game*/) {

        this.ws.addEventListener('open', this.onOpen.bind(this));
        this.ws.addEventListener('close', this.onClose.bind(this));
        this.ws.addEventListener('message', this.onMessage.bind(this));

        this.hit = this.hit.bind(this, ws);
        this.endTurn = this.endTurn.bind(this, ws);

        this.gui = new PlayerGUI();
        this.gui.init(); // No-op for now

        this.gui.hitButton.addEventListener('click', this.hit);
        this.gui.stayButton.addEventListener('click', this.endTurn);
    }

    hit(): void {
        console.log('Hit me!');
        this.ws.send(JSON.stringify({ type: 'HIT', id: this.id }));
    }

    endTurn(): void {
        console.log('end turn id:', this.id);
        this.ws.send(JSON.stringify({ type: 'STAY', id: this.id }));
    }

    onMessage(res: Message): void {
        const json = JSON.parse(res.data);
        console.log('DATA:', json);

        if (!json.id) {
            console.error(`No id provided!`);
        }

        switch (json.type) {
            case MessageType.HIT:
            case MessageType.BUST:
            case MessageType.BLACKJACK:
                for (let card of json.cards) {
                    this.gui.addCard(card);
                };
                break;
            case MessageType.STAY:
                // Disable buttons
                break;
            case MessageType.CONNECTED:
                this.id = json.id;
                console.log(`Connected to server. ID: ${this.id}`);
                break;
            default:
                console.log(`No matching MessageType. msg:`, json.msg);
        }
    }

    onOpen() { }

    onClose() { }
}