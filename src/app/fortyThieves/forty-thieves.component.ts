import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../models/card';
import { Pile } from '../models/pile';

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
    stock: new Pile('stock', 0),
    waste: new Pile('waste', 0)
  };

  draggedCard: Card | null = null;
  draggedFrom: Pile | null = null;
  dragX: number = 0;
  dragY: number = 0;
  solved: boolean = false;
  startTime!: number;
  elapsedMs = 0;
  gameOver = false;
  viewReady = false;

  constructor() { }

  ngAfterViewInit() {
    setTimeout(() => this.startGame());
  }

  startGame() {
    this.viewReady = true;
      // reset piles
    this.piles = {
      foundation: [],
      tableau: [],
      stock: new Pile('stock', 0),
      waste: new Pile('waste', 0)
    };

    this.draggedCard = null;
    this.draggedFrom = null;
    this.initPiles();
    const deck = this.createDeck();

    // deal 4 cards to each tableau pile, last one faceUp
    for (let i = 0; i < 10; i++) {
      const pile = this.piles.tableau[i];
      for (let k = 0; k < 3; k++) {
        const c = deck.pop()!;
        c.faceUp = true;
        pile.push(c);
      }
      const last = deck.pop()!;
      last.faceUp = true;
      pile.push(last);
    }

    // remaining to stock
    while (deck.length > 0) this.piles.stock.push(deck.pop()!);
  }

  initPiles() {
    const suits: Array<'♠' | '♥' | '♦' | '♣'> = ['♠','♥','♦','♣'];

    for (let i = 0; i < 8; i++) {
      const f = new Pile('foundation', i);
      f.suit = suits[i % 4];
      this.piles.foundation.push(f);
    }

    for (let i = 0; i < 10; i++) this.piles.tableau.push(new Pile('tableau', i));
  }

  createDeck(): Card[] {
    const suits: Array<'♠' | '♥' | '♦' | '♣'> = ['♠','♥','♦','♣'];
    const deck: Card[] = [];
    for (let d = 0; d < 2; d++)
      for (let s of suits)
        for (let r = 1; r <= 13; r++)
          deck.push(new Card(s, r, true));

    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  startDrag(fromPile: Pile, event: PointerEvent, card?: Card, ) {
    if(!card) return;
    if (!card.faceUp) return;
    this.draggedCard = card;
    this.draggedFrom = fromPile;
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
  }

  dropOnPile(event?: PointerEvent) {
    if (!this.draggedCard || !this.draggedFrom) return;
    if (event){
      const elem = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement;
      const pileId = elem.closest('.pile')?.getAttribute('data-pile-id');
      const pileName = elem.closest('.pile')?.getAttribute('data-pile-name');

      if (!pileId) { this.resetDrag(); return; }
      const toPile = this.getPile(pileId, pileName); 
      if(!toPile) {this.resetDrag; return;}

      const card = this.draggedCard;
      if (this.tryMoveToFoundation(card, toPile) || this.tryMoveToTableau(card, this.draggedFrom, toPile)) {
        this.resetDrag();
      } 
    } else {
      this.resetDrag();
    }
  }

    getPile(pileId: any, pileName: any){
      var pile;
      if(pileName && pileId && pileName == 'foundation'){
        pile = this.piles.foundation.find(x => x.id == pileId);
      }
      if(pileName && pileId && pileName == 'tableau'){
        pile = this.piles.tableau.find(x => x.id == pileId);
      }
      return pile;
    }
 

  tryMoveToFoundation(card: Card, targetPile: Pile): boolean {
    if (targetPile.name !== 'foundation' || targetPile.suit !== card.suit) return false;
    const top = targetPile.top();

    if (!top && card.rank === 1 || (top && card.rank === top.rank + 1)) {
      this.draggedFrom!.remove(card);
      targetPile.push(card);
      this.draggedFrom!.cards = [...this.draggedFrom!.cards];
      targetPile.cards = [...targetPile.cards];
      return true;
   }
    return false;
  }

  tryMoveToTableau(card: Card, fromPile: Pile, toPile: Pile): boolean {
    if (toPile.name !== 'tableau') return false;
    const top = toPile.top();

    // allow empty pile or same-suit descending
    if (!top || (card.suit === top.suit && card.rank === top.rank - 1)) {
      fromPile.remove(card);
      toPile.push(card);
      fromPile.cards = [...fromPile.cards];
      toPile.cards = [...toPile.cards];
      return true;
    }
    return false;
  }

  resetDrag() {
    this.draggedCard = null;
    this.draggedFrom = null;
  }

  onPointerMove(event: PointerEvent) {
    if (!this.draggedCard) return;
    this.dragX = event.clientX - 24;
    this.dragY = event.clientY - 35;
  }

  trackByIndex(index: number, _item: any): number {
    return index;
  }

  drawFromStock() {
    const c = this.piles.stock.pop();
    if (!c) return;
    c.faceUp = true;
    this.piles.waste.push(c);

    // Force Angular to detect array changes
    this.piles.stock.cards = [...this.piles.stock.cards];
    this.piles.waste.cards = [...this.piles.waste.cards];
  }

  // optional = convert ms to mm:ss
  get formattedTime(): string {
    const sec = Math.floor(this.elapsedMs / 1000);
    const mm = Math.floor(sec / 60).toString().padStart(2, '0');
    const ss = (sec % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  }

  noCardsLeft(){
    var cardsLeft = this.piles.stock.cards.length;
   // return cardsLeft == 0;
   return true;
  }

  checkGameOver(){
    var gameOver = this.piles.stock.cards.length == 0 || this.solved;
    this.gameOver = gameOver;
    return gameOver;
  }

}
