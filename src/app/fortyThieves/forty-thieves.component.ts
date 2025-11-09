import { Component } from '@angular/core';
import { Card } from '../models/card';
import { Pile } from '../models/pile';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forty-thieves',
  templateUrl: './forty-thieves.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./forty-thieves.component.css']
})
export class FortyThievesComponent {

  piles = {
    foundation: [] as Pile[],
    tableau: [] as Pile[],
    stock: new Pile('stock'),
    waste: new Pile('waste')
  };

  selectedCard: { card: Card, from: Pile } | null = null;
  draggedCard: Card | null = null;
  draggedFrom: Pile | null = null;
  hoveredPile: Pile | null = null;
  dragX: number = 0;  // current mouse X
  dragY: number = 0;  // current mouse Y

  constructor() {
  this.initPiles();
  const deck = this.createDeck();

  // deal 4 cards to each tableau pile, only last one faceUp
  for (let i = 0; i < 10; i++) {
    const pile = this.piles.tableau[i];
    // first 3 cards faceDown
    for (let k = 0; k < 3; k++) {
      const c = deck.pop()!;
      c.faceUp = true;
      pile.push(c);
    }
    // last card faceUp
    const last = deck.pop()!;
    last.faceUp = true;
    pile.push(last);
  }
    // remaining go to stock
    while (deck.length > 0) {
      this.piles.stock.push(deck.pop()!);
    }
  }


  createDeck(): Card[] {
  const suits: Array<'♠' | '♥' | '♦' | '♣'> = ['♠','♥','♦','♣'];
  const deck: Card[] = [];

  for (let d = 0; d < 2; d++) { // 2 decks
    for (let s of suits) {
      for (let r = 1; r <= 13; r++) {
        deck.push(new Card(s, r, true)); // 40 Thieves: all cards face up
      }
    }
  }

  // shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}


  initPiles() {
  // create foundation piles
  const suits: Array<'♠' | '♥' | '♦' | '♣'> = ['♠','♥','♦','♣'];

  for (let i = 0; i < 8; i++) {
    const f = new Pile('foundation');
    f.suit = suits[i % 4]; // two piles per suit
    this.piles.foundation.push(f);
  }

  // create tableau piles
  for (let i = 0; i < 10; i++) {
    this.piles.tableau.push(new Pile('tableau'));
  }
}


  trackByIndex(index: number, _item: any): number { return index; }

  drawFromStock() {
  const c = this.piles.stock.cards.pop();
  if (!c) return;
  this.piles.waste.cards.push(c);
}

  tryMoveToFoundation(card: Card, fromPile: Pile): boolean {
  for (const f of this.piles.foundation) {
    if (f.suit !== card.suit) continue;  // only match correct suit

    const top = f.top();
    if (!top) {
      if (card.rank === 1) { // Ace
        f.push(card);
        return true;
      }
    } else if (card.rank === top.rank + 1) {
      f.push(card);
      return true;
    }
  }
  return false;
}



  tryMoveToTableau(card: Card, fromPile: Pile, toPile: Pile) {
  const top = toPile.top();

  if (!top) {
    // tableau piles CAN NEVER start empty in Forty Thieves
    return false;
  }

  if (card.suit === top.suit && card.rank === top.rank - 1) {
    fromPile.remove(card);
    toPile.push(card);
    return true;
  }

  return false;
}


selectOrFoundation(card: Card, pile: Pile) {
  // first try foundation
  if (this.tryMoveToFoundation(card, pile)) return;

  // otherwise select for tableau move
  this.selectedCard = { card, from: pile };
}

tryDropOnPile(toPile: Pile) {
  if (!this.selectedCard) return;
  const { card, from } = this.selectedCard;

  if (this.tryMoveToTableau(card, from, toPile)) {
    this.selectedCard = null;
  }
}

startDrag(card: Card, fromPile: Pile, event: PointerEvent) {
  if (!card.faceUp) return;

  this.draggedCard = card;
  this.draggedFrom = fromPile;

  const elem = (event.target as HTMLElement);
  elem.setPointerCapture(event.pointerId);
}


dropOnPile(toPile: Pile) {
  if (!this.draggedCard || !this.draggedFrom) return;

  const card = this.draggedCard;

  // try foundation first
  if (this.tryMoveToFoundation(card, this.draggedFrom)) {
    this.draggedFrom.remove(card); // remove now
    this.resetDrag();
    return;
  }

  // then tableau
  if (this.tryMoveToTableau(card, this.draggedFrom, toPile)) {
    this.draggedFrom.remove(card); // remove now
    this.resetDrag();
    return;
  }

  this.resetDrag(); // invalid move, card stays in place
}


resetDrag() {
  this.draggedCard = null;
  this.draggedFrom = null;
}

onPointerMove(event: PointerEvent) {
  if (!this.draggedCard) return;
  this.dragX = event.clientX - 24; // adjust so card center follows pointer
  this.dragY = event.clientY - 35;
}

}
