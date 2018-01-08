import { Game } from './Game';
import { Player } from './Player';
import { Card } from './Deck';
import * as WebSocket from 'ws';

export interface Message {
    type: MessageType;
    id: number;
    cards: Card[];
    msg?: string;
    data?: any; // Card data?
}

export enum MessageType {
    CONNECTED = 'CONNECTED',
    DISCONNECTED = 'DISCONNECTED',
    HIT = 'HIT',
    STAY = 'STAY',
    BUST = 'BUST',
    BLACKJACK = 'BLACKJACK',
    // DEAL = 'DEAL',
}

export class WSServer {

    private connections: WebSocket[] = [];
    private clientID: number = 0;

    constructor(private game: Game, server: WebSocket.Server) {
        server.on('connection', (ws) => {
            ws.on('message', this.onMessage.bind(this, ws));
            ws.on('close', this.onClose.bind(this, ws, game));

            this.connections.push(ws);
            this.clientID++;
            ws.id = this.clientID;

            this.game.totalPlayers++;
            this.game.players.push(new Player(game, this.clientID));

            console.log(`Player joined! Total: ${game.totalPlayers}`);

            ws.send(JSON.stringify({ id: this.clientID, type: MessageType.CONNECTED }));
        });
    }

    public sendHands(players): void {
        this.connections.forEach((connex, i) => {
            const type = 'HIT';
            const cards = players[i].hand;
            const id = connex.id;

            connex.send(JSON.stringify({ type, cards, id }));
        });
    }

    private onMessage(ws, data) {
        const json = JSON.parse(data);
        console.log('json:', json);
        const id = json.id;
        const player = this.game.players.find(player => player.id === id);

        let msg = 'No message';
        let cards = null;
        let type = json.type;

        switch (json.type) {
            case MessageType.HIT:
                // Either send one card at a time, or the whole hand
                cards = [ player.hit(1) ];

                if (player.bust) {
                    type = MessageType.BUST;
                    msg = `Player ${id} BUSTED!`;
                    console.log(`cards:`, cards[0].display);
                    // End turn
                } else if (player.blackjack) {
                    type = MessageType.BLACKJACK;
                    msg = `Player ${id} has blackjack!`;
                } else {
                    msg = `Card data for ${id}: ${cards[0].display}`
                }

                break;
            case MessageType.STAY:
                msg = `Ending turn: ${id}`;
                // call nextPlayer
                break;
            default:
                msg = `hi ${id}`;
        }
        console.log(`player:`, player);
        ws.send(JSON.stringify({ msg, cards, type, id }));
    }

    private onClose(ws, game) {
        game.totalPlayers--;
        console.log(`Player left, total players: ${game.totalPlayers}`);

        const connIdx = this.connections.findIndex(cnx => cnx === ws);
        this.connections.splice(connIdx, 1);
    }
}