import Deck from './Deck';
import Player from './Player';
import Dealer from './Dealer';
import * as WebSocket from 'ws';
import WSServer from './WSServer';
import WSClient from './WSClient';

const HOST = 'localhost';
const WSS_PORT = 8081;

export default class Game {

    // public ws: WebSocket;
    private wsServer: WebSocket.Server;
    public totalPlayers: number = 1; // Dealer
    public newPlayers: number = 0;
    public dealer: Dealer;
    public players: any[] = []; // TODO: No any
    private curr: number = 0;
    // private endState: Element;
    public deck: Deck;

    constructor() {
        // this.refresh = this.refresh.bind(this);
    }

    public initDealer(): void {
        // Set up a server, which calls addPlayer on a new connection
        this.wsServer = new WSServer(this, new WebSocket.Server({ port: WSS_PORT }));
        console.log(`Dealer: ws server listening on port ${WSS_PORT}`);

        this.deck = new Deck(1);
        
        this.dealer = new Dealer(this, null, 0);
        // this.players.push(this.dealer);
    }

    public initPlayer(): void {
        console.log('Player, setting up ws client');

        const ws = new WSClient(HOST, WSS_PORT);
        // this.players.push(new Player(this, ws, this.totalPlayers++));
    }

    play(): void {
        // TODO: set up turns, so hit/stay only works when it's that player's turn
        // TODO: Add players
        // this.totalPlayers += this.newPlayers;
        // this.deck = new Deck(1);
        // this.players.push(new Dealer(this, null, 0));
        // this.makePlayers();
        console.log('Total players:', this.totalPlayers);
        this.deal(this.players);
    }

    deal(players): void {
        this.dealer.deal();
        players.forEach((player, i) => {
            console.log('player number:', i);
            // player.discard(this.deck);
            this.deck.moveHandToDiscards(player.hand);
            player.deal();
        });
        this.wsServer.sendHands(players);
        // this.nextPlayer();
    }

    // UNCOMMENT ALL THESE WHEN YOU'VE GOT BASIC COMMUNICATION WORKING

    // nextPlayer(): void {
    //     this.players[this.curr].gui.disable();
    //     // this.curr++;
    //     if (this.curr < this.totalPlayers) {
    //         this.players[this.curr].gui.enable();
    //     } else {
    //         this.curr = 0;
    //         this.players[this.curr].dealerTurn();
    //     }
    // }

    // end(): void {
    //     // TODO: Make this work for multiple players
    //     const dealer = this.players[0];
    //     const player = this.players[1];

    //     const endText = this.setEndText(dealer, player);
    //     const reason = this.setEndReason(dealer, player);

    //     // this.endState.innerHTML = `<h1>${endText}</h1><h5>${reason}</h5>`;
    //     // this.endState.classList.toggle('hidden');
    // }

    // refresh(): void {
    //     // this.endState.classList.toggle('hidden');
    //     this.curr = 0;
    //     this.deal();
    // }

    // setEndText(dealer, player): string {
    //     if (!dealer.bust && ((dealer.blackjack && !player.blackjack) || player.bust || player.score < dealer.score)) {
    //         return 'You lose!';
    //     }
    //     if (dealer.bust || (player.blackjack && !dealer.blackjack) || player.score > dealer.score) {
    //         return 'You win!';
    //     }
    //     return 'Tie!';
    // }

    // setEndReason(dealer, player): string {
    //     if (player.bust) {
    //         return 'Busted!';
    //     } else if (player.blackjack) {
    //         return 'Blackjack!';
    //     } else if (dealer.bust) {
    //         return 'Dealer busted!';
    //     } else if (dealer.blackjack) {
    //         return 'Dealer has blackjack!';
    //     } else if (player.score < dealer.score) {
    //         return 'Dealer is higher!';
    //     } else if (player.score > dealer.score) {
    //         return 'Player is higher!';
    //     }
    //     return null;
    // }
}
