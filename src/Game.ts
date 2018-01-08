import { Deck } from './Deck';
import { Player } from './Player';
import { Dealer } from './Dealer';
import { WSServer } from './WSServer';
import { WSClient } from './WSClient';
import * as WebSocket from 'ws';

const HOST = 'localhost';
const WSS_PORT = 8081;

export class Game {

    private wsServer: WebSocket.Server;
    public totalPlayers: number = 1; // Dealer
    public dealer: Dealer;
    public players: any[] = []; // TODO: No any
    private curr: number = 0;
    // private endState: Element;
    public deck: Deck;

    constructor() {
        // this.refresh = this.refresh.bind(this);
    }

    public initDealer(): void {
        // Set up a server, which creates a new Player on a new connection
        console.log(`Dealer: ws server listening on port ${WSS_PORT}`);
        this.wsServer = new WSServer(this, new WebSocket.Server({ port: WSS_PORT }));

        this.deck = new Deck(1);
        
        this.dealer = new Dealer(this, 0);
        // this.players.push(this.dealer);
    }

    public initPlayer(): void {
        console.log('Player, setting up ws client');
        const ws = new WSClient(HOST, WSS_PORT);
    }

    play(): void {
        console.log('Total players:', this.totalPlayers);
        this.deal(this.players);
    }

    deal(players: Player[]): void {
        this.dealer.discard(this.deck);
        
        players.forEach((player, i) => {
            console.log('player number:', i);
            player.discard(this.deck);
            player.deal();
        });
        this.wsServer.sendHands(players);

        this.dealer.deal();
        // if dealer has blackjack, send a message to all players
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
