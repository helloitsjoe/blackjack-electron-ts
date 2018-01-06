// import Game from './Game';

export default class WSClient {

    public ws: any;
    public players: any;
    private id: number;
    // private game: Game;

    constructor(host: string, port: number/*, game: Game*/) {
        const ws: any = new WebSocket(`ws://${host}:${port}`);
        ws.hit = this.hit.bind(this);
        ws.endTurn = this.endTurn.bind(this);

        ws.addEventListener('open', this.onOpen.bind(this));
        ws.addEventListener('close', this.onClose.bind(this));
        ws.addEventListener('message', this.onMessage.bind(this));

        this.ws = ws;
        this.initButtons();
        // this.game = game;
    }

    private initButtons() {
        const hitButton = document.getElementById('hit-button');
        hitButton.addEventListener('click', () => {
            console.log('hit from', this.id)
            this.ws.send(JSON.stringify({ msg: 'HitMe', id: this.id }));
        });
    }

    hit(card, position) {
        console.log(`WSClient.hit`);
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

    onMessage(res) {
        const data = JSON.parse(res.data);
        console.log('DATA:', data);
        console.log(`data.id:`, data.id);
        this.id = data.id || this.id; // Why fallback to this.id?

        if (data.msg === 'deal') {
            for (let card of data.hand) {
                this.addCard(card);
            }
        }
        // if (data.msg === 'hit') {
        //     console.log('hit pingback')
        //     this.addCard(data.card);
        // }

        // if (data.msg === 'new player') {
        //     console.log('NEW ONE');
        //     this.game.newPlayers += 1;
        // } else if (data.msg === 'HitMe') {
        //     this.game.players[data.id].hit();
        // }
        // console.log('players:', data.totalPlayers);
        // this.players = data.totalPlayers;
    }

    private addCard(card) {
        const cardBox = document.getElementById('card-box');
        cardBox.innerHTML += `<div class="card">${card.display}</div>`
    }

    onOpen() { }

    onClose() { }
}