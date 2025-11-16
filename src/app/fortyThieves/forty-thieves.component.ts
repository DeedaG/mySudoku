import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from './models/card';
import { Pile } from './models/pile';
import { Router } from '@angular/router';
import { Selection } from './models/selection';
import { OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-forty-thieves',
  templateUrl: './forty-thieves.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./forty-thieves.component.css']
})
export class FortyThievesComponent {
  isBrowser: boolean = false;
  piles = {
    foundation: [] as Pile[],
    tableau: [] as Pile[],
    stock: new Pile('stock', 0),
    waste: new Pile('waste', 0)
  };

  solved: boolean = false;
  startTime!: number;
  elapsedMs = 0;
  gameOver = false;
  viewReady = false;
  screenWidth: number = 0;
  intervalId: any;
  selection: Selection = {};

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
  private router: Router) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      setTimeout(() => this.startGame());
    }
  }

  startGame() {
    if (!this.isBrowser) return; 
    this.viewReady = true;
      // reset piles
    this.piles = {
      foundation: [],
      tableau: [],
      stock: new Pile('stock', 0),
      waste: new Pile('waste', 0)
    };

    this.selection = {};
    this.initPiles();
    if (!this.isBrowser) return;
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
    this.startTimer();
  }


  startTimer() {
    if (!this.isBrowser) return;
    this.startTime = Date.now();
    this.intervalId = setInterval(() => {
      this.elapsedMs = Date.now() - this.startTime;
    }, 1000); // update every sec
  }

  stopTimer() {
    if (!this.isBrowser) return;
    clearInterval(this.intervalId);
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

  startDrag(fromPile: Pile, card?: Card, ) {
    if (!this.isBrowser) return;
    if(!card) return;
    if(card.selected) {
      card.selected = false;
      this.selection = {};
      return;
    }
    if(this.selection && this.selection.card)return;
    card.selected = true;
    this.selection = {
      card: card,
      fromPile: fromPile
    };
    
    console.log('card start drag', card);
  }

  dropOnPile(toPile: Pile) {
    if (!this.selection || !toPile || !this.selection.fromPile || toPile == this.selection.fromPile) return;
    var card = this.selection.card ? this.selection.card : null;
    this.selection.toPile = toPile;
      if (card && (this.tryMoveToFoundation(card) || this.tryMoveToTableau(card))) {
        this.resetDrag();
        card.selected = false;
      } 
      console.log('selection', this.selection);
  }
 

  tryMoveToFoundation(card: Card): boolean {
    if (this.selection.toPile?.name !== 'foundation' || this.selection.toPile?.suit !== card.suit) return false;
    const top = this.selection.toPile?.top();

    if (!top && card.rank === 1 || (top && card.rank === top.rank + 1)) {
      card.selected = false;
      this.selection.fromPile!.remove(card);
      this.selection.toPile?.push(card);
      this.selection.fromPile!.cards = [...this.selection.fromPile!.cards];
      this.selection.toPile.cards = [...this.selection.toPile.cards];
      return true;
   }
    return false;
  }

  tryMoveToTableau(card: Card): boolean {
    if(!this.selection.fromPile) return false;
    if (this.selection.toPile?.name !== 'tableau') return false;
    const top = this.selection.toPile.top();

    // allow empty pile or same-suit descending
    if (!top || (card.suit === top.suit && card.rank === top.rank - 1)) {
      card.selected = false;
      this.selection.fromPile.remove(card);
      this.selection.toPile.push(card);
      this.selection.fromPile.cards = [...this.selection.fromPile.cards];
      this.selection.toPile.cards = [...this.selection.toPile.cards];
      return true;
    }
    return false;
  }

  resetDrag() {
    this.selection = {};
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
    var card = this.selection.card ? this.selection.card.selected = false : this.selection.card;
    this.selection = {};
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

   goBack(){
    this.router.navigateByUrl('/');
   }

}
