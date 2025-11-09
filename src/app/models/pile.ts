import { Card } from './card';

export class Pile {
  name: string;
  cards: Card[] = [];
  suit?: '♠' | '♥' | '♦' | '♣'; // optional, only for foundations

  constructor(name: string) {
    this.name = name;
  }

  push(card: Card) {
    this.cards.push(card);
  }

  pop(): Card | undefined {
    return this.cards.pop();
  }

  top(): Card | undefined {
    return this.cards[this.cards.length - 1];
  }

  remove(card: Card) {
    const idx = this.cards.indexOf(card);
    if (idx !== -1) this.cards.splice(idx, 1);
  }
}
