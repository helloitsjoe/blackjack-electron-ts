import WebSocket from 'ws';
import Game from './Game';
import Player from './Player';

export default class WSServer {

    private connections: WebSocket[] = [];
    private currID: number = 0;

    constructor(game: Game, server: WebSocket.Server) {
        server.on('connection', (ws) => {
            ws.on('message', this.onMessage.bind(null, ws));
            ws.on('close', this.onClose.bind(this, ws, game));
            // Add id to ws? ws.id = newID;
            
            this.connections.push(ws);

            const id = this.addPlayer(ws, game);
            console.log(`Player joined! Total: ${game.totalPlayers}`);

            ws.send(JSON.stringify({ id }));
        });
    }

    public addPlayer(ws, game) {
        this.currID++;
        game.totalPlayers++;
        game.players.push(new Player(game, ws, this.currID));
        return this.currID;
    }

    public sendHands(players): void {
        this.connections.forEach((connex, i) => {
            connex.send(JSON.stringify({ msg: 'deal', hand: players[i].hand }))
        });
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

    private onClose(ws, game) {
        game.totalPlayers--;
        console.log(`Player left, total players: ${game.totalPlayers}`);

        const connIdx = this.connections.findIndex(cnx => cnx === ws);
        this.connections.splice(connIdx, 1);
    }
}