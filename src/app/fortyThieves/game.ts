// import { Card, Suit, Rank } from '../models/card';
// import { Pile } from '../models/pile';

// export class Game {
//   tableau: Pile[] = [];
//  // foundations: Pile[] = [[], [], [], []];
// //  stock: Pile = [];
// //  waste: Pile = [];

//   constructor() {
//     this.newGame();
//   }

//   newGame() {
//     const deck = this.createDeck();
//     this.shuffle(deck);

//     // Deal 40 cards to 8 tableau piles (5 each)
//     this.tableau = [];
//     for (let i = 0; i < 8; i++) {
//       this.tableau.push(deck.splice(0, 5));
//     }

//     // Remaining cards go to stock
//     this.stock = deck;
//     this.foundations = [[], [], [], []];
//     this.waste = [];
//   }

//   createDeck(): Card[] {
//     const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
//     const ranks: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
//     const deck: Card[] = [];

//     // Two decks
//     for (let d = 0; d < 2; d++) {
//       for (const suit of suits) {
//         for (const rank of ranks) {
//           deck.push({ suit, rank, faceUp: true });
//         }
//       }
//     }

//     return deck;
//   }

//   shuffle(deck: Card[]) {
//     // Fisher-Yates shuffle
//     for (let i = deck.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [deck[i], deck[j]] = [deck[j], deck[i]];
//     }
//   }

//   // TODO: implement move validation
// }
