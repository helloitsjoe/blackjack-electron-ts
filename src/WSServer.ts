import WebSocket = require('ws');
import Game from './Game';

export default class WSServer {
    
    private game: Game;
    private port: number;
    private server: WebSocket.Server;
    private connections: WebSocket[] = [];
    
    constructor(game, port) {
        this.game = game;
        this.server = new WebSocket.Server({ port });
    }
    
    public init(): void {
        this.server.on('connection', (ws) => {
            ws.on('message', this.onMessage.bind(null, ws));
            ws.on('close', this.onClose.bind(null, ws));
            
            console.log('new connex bruh');
            const playerId = this.game.addPlayer(ws);
            this.connections.push(ws);
            ws.send(JSON.stringify({
                id: playerId
            }));
        });
    }
    
    public deal(i, hand): void {
        this.connections[i].send(JSON.stringify({ msg:'deal', hand }));
    }

    private onMessage(ws, data) {
        // data = {
        //     msg: string,
        //     id: position,
        //     card: cardData
        // }
        let json = JSON.parse(data);
        console.log('json:', json);
        // const dealer = this.connections[0];
        // dealer.send(JSON.stringify(json));
        if (json.id) {
            if (json.msg === 'HitMe') {
                console.log('hitme');
                ws.send(JSON.stringify({ msg: 'hi' }));
            } else {
                this.connections[json.id].send(data);
            }
        }
    }

    private onClose(ws) {
        let i;
        for (i = 0; i < this.connections.length; i++) {
            if (this.connections[i] === ws) {
                console.log('closed', i);
                break;
            }
        }
        this.connections.splice(i, 1);
    }
}