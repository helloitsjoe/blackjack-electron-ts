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
    private totalPlayers: number = 1; // Dealer
    public newPlayers: number = 0;
    public dealer: Dealer;
    public players: any[] = []; // TODO: No any
    private curr: number = 0;
    private endState: Element;
    public deck: Deck;

    constructor() {
        this.refresh = this.refresh.bind(this);
    }

    public initDealer(): void {
        console.log(`Dealer: ws server listening on port ${WSS_PORT}`);
        const server = new WebSocket.Server({ port: WSS_PORT });
        // Set up a server, which calls addPlayer on a new connection
        this.wsServer = new WSServer(this, server);

        this.deck = new Deck(1);

        this.dealer = new Dealer(this, null, 0);
        // this.players.push(new Dealer(this, null, 0));
    }

    public initPlayer(): void {
        console.log('Player, setting up ws client');

        const ws = new WSClient(HOST, WSS_PORT);
        // this.players.push(new Player(this, ws, this.totalPlayers++));
    }

    public addPlayer(ws) {
        this.totalPlayers++;
        this.players.push(new Player(this, ws, this.totalPlayers));
        return this.totalPlayers;
    }

    play(): void {
        // TODO: set up turns, so hit/stay only works when it's that player's turn
        // TODO: Add players
        // this.totalPlayers += this.newPlayers;
        console.log('players:', this.totalPlayers);
        // this.deck = new Deck(1);
        // this.players.push(new Dealer(this, null, 0));
        // this.makePlayers();
        this.deal();
    }

    // createDealer(): Dealer {
    //     if (!this.dealer) {
    //         return new Dealer();
    //     }
    //     console.warn('There\'s already a dealer!');
    //     return;
    // }
    // 
    // addDealer(): void {
    //     this.players.unshift(this.dealer)
    // }
    // 
    // createPlayer(): Player {
    //     return new Player();
    // }
    // 
    // addPlayer(player: Player): void {
    //     this.players.push(player);
    // }

    // makePlayers(): void {
    //     this.players.push(new Dealer(this, 0));
    //     for (let i = 1; i < this.totalPlayers; i++) {
    //         // dealer is position 0
    //         this.players.push(new Player(this, i));
    //     }
    // }

    deal(): void {
        this.dealer.deal();
        for (let i = 0; i < this.players.length; i++) {
            this.deck.moveHandToDiscards(this.players[i]);

            console.log('player number:', i);
            this.players[i].deal();
            this.wsServer.deal(i, this.players[i].hand);
        }
        // this.nextPlayer();
    }

    nextPlayer(): void {
        // this.players[this.curr].gui.disable();
        this.curr++;
        if (this.curr < this.totalPlayers) {
            this.players[this.curr].gui.enable();
        } else {
            this.curr = 0;
            this.players[this.curr].dealerTurn();
        }
    }

    end(): void {
        // TODO: Make this work for multiple players
        const dealer = this.players[0];
        const player = this.players[1];

        const endText = this.setEndText(dealer, player);
        const reason = this.setEndReason(dealer, player);

        this.endState.innerHTML = `<h1>${endText}</h1><h5>${reason}</h5>`;
        this.endState.classList.toggle('hidden');
    }

    refresh(): void {
        this.endState.classList.toggle('hidden');
        this.curr = 0;
        this.deal();
    }

    setEndText(dealer, player): string {
        if (!dealer.bust && ((dealer.blackjack && !player.blackjack) || player.bust || player.score < dealer.score)) {
            return 'You lose!';
        }
        if (dealer.bust || (player.blackjack && !dealer.blackjack) || player.score > dealer.score) {
            return 'You win!';
        }
        return 'Tie!';
    }

    setEndReason(dealer, player): string {
        if (player.bust) {
            return 'Busted!';
        } else if (player.blackjack) {
            return 'Blackjack!';
        } else if (dealer.bust) {
            return 'Dealer busted!';
        } else if (dealer.blackjack) {
            return 'Dealer has blackjack!';
        } else if (player.score < dealer.score) {
            return 'Dealer is higher!';
        } else if (player.score > dealer.score) {
            return 'Player is higher!';
        }
        return null;
    }
}
