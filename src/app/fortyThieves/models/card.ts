export class Card {
  constructor(
    public suit: '♠' | '♥' | '♦' | '♣',
    public rank: number,  // 1 = Ace ... 13 = King
    public faceUp: boolean = false,
    public selected: boolean = false
  ) {}

  get display(): string {
    const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    return ranks[this.rank - 1] + this.suit;
  }
}

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

