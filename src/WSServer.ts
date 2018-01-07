import WebSocket from 'ws';
import Game from './Game';
import Player from './Player';

interface MessageToServer {
    type: 'HIT' | 'STAY' | 'CONNECTED' | 'DISCONNECTED'; // | 'DEAL'?
    msg?: string;
    id?: number;
    data?: any; // Card data?
}

interface MessageToClient {
    type: string;
    msg?: string;
    id?: number;
    data?: any; // Card data?
}


export default class WSServer {

    private connections: WebSocket[] = [];
    private currID: number = 0;

    constructor(game: Game, server: WebSocket.Server) {
        server.on('connection', (ws) => {
            ws.on('message', this.onMessage.bind(null, ws));
            ws.on('close', this.onClose.bind(this, ws, game));
            // Add id to ws? ws.id = currID;
            
            this.connections.push(ws);

            this.currID++;

            game.totalPlayers++;
            game.players.push(new Player(game, ws, this.currID));

            console.log(`Player joined! Total: ${game.totalPlayers}`);

            ws.send(JSON.stringify({ id: this.currID }));
        });
    }

    public sendHands(players): void {
        this.connections.forEach((connex, i) => {
            connex.send(JSON.stringify({ type: 'HIT', cards: players[i].hand }))
        });
    }

    private onMessage(ws, data) {
        let json = JSON.parse(data);
        let res = { msg: null, id: json.id };
        console.log('json:', json);

        if (json.id) {
            if (json.type === 'HIT') {
                res.msg = `Here's card data for ${json.id}`;
                // res.cards = Cards from game
            } else if (json.msg === 'End Turn') {
                res.msg = `Ending turn ${json.id}`;
                // call nextPlayer
            } else {
                res.msg = `hi ${json.id}`;
            }
        } else {
            res.msg `Error: JSON needs an ID`;
        }
        ws.send(JSON.stringify(res));
    }

    private onClose(ws, game) {
        game.totalPlayers--;
        console.log(`Player left, total players: ${game.totalPlayers}`);

        const connIdx = this.connections.findIndex(cnx => cnx === ws);
        this.connections.splice(connIdx, 1);
    }
}