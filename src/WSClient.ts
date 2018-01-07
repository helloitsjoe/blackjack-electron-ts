import PlayerGUI from './PlayerGUI';
import { MessageType } from './WSServer';

export default class WSClient {

    // public ws: any;
    public players: any;
    private id: number;
    private gui: PlayerGUI;
    // private game: Game;

    constructor(host: string, port: number/*, game: Game*/) {
        const ws: any = new WebSocket(`ws://${host}:${port}`);

        ws.addEventListener('open', this.onOpen.bind(this));
        ws.addEventListener('close', this.onClose.bind(this));
        ws.addEventListener('message', this.onMessage.bind(this));

        this.hit = this.hit.bind(this, ws);
        this.endTurn = this.endTurn.bind(this, ws);

        this.gui = new PlayerGUI();
        this.gui.init(); // No-op for now

        this.gui.hitButton.addEventListener('click', this.hit);
        this.gui.stayButton.addEventListener('click', this.endTurn);
    }

    hit(ws) {
        console.log('Hit me!')
        ws.send(JSON.stringify({ type: 'HIT', id: this.id }));
    }

    endTurn(ws) {
        console.log('end turn id:', this.id)
        ws.send(JSON.stringify({ type: 'STAY', id: this.id }));
    }

    onMessage(res) {
        const json = JSON.parse(res.data);
        console.log('DATA:', json);
        this.id = json.id || this.id; // Why fallback to this.id?

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
            default:
                console.log(`No matching MessageType. msg:`, json.msg);
        }
    }

    onOpen() { }

    onClose() { }
}