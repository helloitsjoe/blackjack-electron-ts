export interface Card {
    suit: string;
    value: number;
    face: string;
    display: string;
}

export class Deck {

    public cards: Card[] = [];
    public discards: Card[] = [];

    constructor() {
        // this.init(numPacks);
        // this.shuffle();

        // debug
        // this.cards.forEach((card) => {
        //     console.log(card);
        // });
        // console.log(this.cards.length)
    }

    init(numPacks: number): void {
        const suits = {
            clubs: 0,
            hearts: 1,
            diamonds: 2,
            spades: 3
        }

        const faces = (val) => {
            switch (val) {
                case 1:
                    return 'A';
                case 11:
                    return 'J';
                case 12:
                    return 'Q';
                case 13:
                    return 'K';
                default:
                    return val;
            }
        }

        // for each pack of cards
        for (let n = 0; n < numPacks; n++) {
            // for each suit
            for (let suit in suits) {
                // push 13 cards
                for (let i = 1; i <= 13; i++) {
                    let value = i > 10 ? 10 : (i === 1 ? 11 : i);
                    let display = `${faces(i)}</br>${suit}`;
                    let card: Card = {
                        value,
                        display,
                        suit: suits[suit],
                        face: faces(i),
                    };
                    this.cards = [...this.cards, card];
                }
            }
        }
    }

    shuffle(): void {
        // console.log('Shuffling...');
        // transfer cards from discard array
        if (!this.cards.length && this.discards.length) {
            this.cards = [...this.cards, ...this.discards];
            this.discards.length = 0;
        }

        // shuffle deck;
        let currIndex = this.cards.length;
        let randomIndex;
        let temp;

        while (currIndex > 0) {
            randomIndex = Math.floor(Math.random() * currIndex);
            currIndex--;

            temp = this.cards[currIndex];
            this.cards[currIndex] = this.cards[randomIndex];
            this.cards[randomIndex] = temp;
        }
    }

    deal(): Card {
        if (!this.cards.length) {
            this.shuffle();
        }
        return this.cards.pop();
    }
}
