import Deck from './Deck';
import Player from './Player';
import Dealer from './Dealer';

export default class Game {

    private totalPlayers: number = 1; // Dealer
    private players: any[] = []; // TODO: No any
    private curr: number = 0;
    private endState: Element;
    public deck: Deck;
    public ws: WebSocket;

    constructor(ws: WebSocket) {
        this.endState = document.getElementById('end-state');
        this.refresh = this.refresh.bind(this);
        this.endState.addEventListener('click', this.refresh);
        this.ws = ws;
    }

    play(): void {
        // TODO: set up turns, so hit/stay only works when it's that player's turn
        // TODO: Add players
        // const newPlayers = prompt('How many players?');
        const newPlayers = 1;
        this.totalPlayers += newPlayers;
        this.deck = new Deck(1);
        this.makePlayers();
        this.deal();
    }

    makePlayers(): void {
        this.players.push(new Dealer(this, 0));

        for (let i = 1; i < this.totalPlayers; i++) {
            // dealer is position 0
            this.players.push(new Player(this, i));
        }
    }

    deal(): void {
        for (let i = 0; i < this.totalPlayers; i++) {
            this.players[i].deal();
        }
        this.nextPlayer();
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

        dealer.reveal();

        const endText = this.setEndText(dealer, player);
        const reason = this.setReason(dealer, player);

        this.endState.innerHTML = `<h1>${endText}</h1><h5>${reason}</h5>`;
        this.endState.classList.toggle('hidden');
    }

    setEndText(dealer, player): string {
        if (!dealer.bust && ((dealer.blackjack && !player.blackjack) || player.bust || player.score < dealer.score)) {
            return 'You lose!';
        } else if (dealer.bust || (player.blackjack && !dealer.blackjack) || player.score > dealer.score) {
            return 'You win!';
        }
        return 'Tie!';
    }

    setReason(dealer, player): string {
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

    refresh(): void {
        this.endState.classList.toggle('hidden');
        this.curr = 0;
        this.deal();
    }
}
