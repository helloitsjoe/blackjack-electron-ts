import Game from './Game';

export default class WSClient {
    
    public ws: any;
    public players: any;
    private game: Game;
    
    constructor(host: string, port: number, game: Game) {
        this.ws = new WebSocket(`ws://${host}:${port}`);
        this.ws.hit = this.hit.bind(this);
        this.ws.endTurn = this.endTurn.bind(this);
        this.ws.addEventListener('open', this.onOpen.bind(this));
        this.ws.addEventListener('close', this.onClose.bind(this));
        this.ws.addEventListener('message', this.onMessage.bind(this));
        this.game = game;
    }
    
    hit(card, position) {
        const data = JSON.stringify({
            msg: 'Hit',
            id: position,
            card: card,
        });
        this.ws.send(data);
    }
    
    endTurn(position) {
        const data = JSON.stringify({ msg: 'End Turn', id: position });
        this.ws.send(data);
    }
    
    onOpen() {
        
    }
    
    onClose() {
        
    }
    
    onMessage(res) {
        const data = JSON.parse(res.data);
        console.log('DATA:', data);
        if (data.msg === 'new player') {
            console.log('NEW ONE');
            this.game.newPlayers += 1;
        } else if (data.msg === 'HitMe') {
            this.game.players[data.id].hit();
        }
        // console.log('players:', data.totalPlayers);
        // this.players = data.totalPlayers;
    }
}