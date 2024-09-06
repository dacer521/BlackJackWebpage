class Card {
    static RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    static SUITS = ["Diamonds", "Hearts", "Spades", "Clubs"];

    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit.charAt(0).toUpperCase() + suit.slice(1);
    }

    toString() {
        switch (this.rank) {  
            case 1:
                return `Ace of ${this.suit}`;
            case 11:
                return `Jack of ${this.suit}`;
            case 12:
                return `Queen of ${this.suit}`;
            case 13:
                return `King of ${this.suit}`;
            default:
                return `${this.rank} of ${this.suit}`;
        }
    }
}

class Deck {
    constructor() {
        this.cards = [];
        for (let suit of Card.SUITS) {
            for (let rank of Card.RANKS) {
                this.cards.push(new Card(rank, suit));
            }
        }
        this.shuffle();
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    deal() {
        return this.cards.length > 0 ? this.cards.pop() : null;
    }

    calcValue(hand) {
        let total = 0;
        let aces = 0;

        for (let card of hand) {
            if (card.rank === 1) {
                aces += 1;
                total += 11;
            } else if ([11, 12, 13].includes(card.rank)) {
                total += 10;
            } else {
                total += card.rank;
            }
        }

        while (total > 21 && aces > 0) {
            total -= 10;
            aces -= 1;
        }

        return total;
    }
}

class BlackJack {
    constructor(player) {
        this.player = player;
        this.deck = new Deck();
        this.hand = [this.deck.deal(), this.deck.deal()];
        this.bust = false;
        this.done = false;
    }

    hit() {
        const dealtCard = this.deck.deal();
        this.hand.push(dealtCard);
        if (this.player) {
            console.log(`You got dealt a ${dealtCard}`);
        }
        if (this.deck.calcValue(this.hand) > 21) {
            this.bust = true;
        }
        return this.deck.calcValue(this.hand);
    }

    stand() {
        this.done = true;
    }

    eval(com, bet) {
        const playerVal = this.deck.calcValue(this.hand);
        const comVal = com.deck.calcValue(com.hand);

        console.log(`Player total: ${playerVal}, House total: ${comVal}`);
        
        if (this.bust && com.bust) {
            return ['tie', 0];
        } else if (this.bust && !com.bust) {
            return ['com win', -bet];
        } else if (com.bust && !this.bust) {
            return ['player win', bet];
        } else if (playerVal > comVal) {
            return ['player win', bet];
        } else if (playerVal < comVal) {
            return ['com win', -bet];
        } else {
            return ['tie', 0];
        }
    }
}

function game(player, com, bet) {
    while (true) {
        console.log(`Your total is ${player.deck.calcValue(player.hand)}`);
        let action = prompt('Would you like to hit or stand? ').toLowerCase();
        if (action === 'hit') {
            player.hit();
            if (player.bust) {
                console.log("Player busts!");
                return ['com win', -bet];
            }
        }
        if (action === 'stand') {
            player.stand();
            break;
        }
    }

    while (com.deck.calcValue(com.hand) <= 16 && !com.bust) {
        com.hit();
        if (com.bust) {
            console.log("Computer busts!");
            return ['player win', bet];
        }
    }

    return player.eval(com, bet);
}