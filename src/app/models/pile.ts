import { Card } from './card';

export class Pile {
  id: number;
  name: string;
  cards: Card[] = [];
  suit?: '♠' | '♥' | '♦' | '♣'; // optional, only for foundations

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
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
