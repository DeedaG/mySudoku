export interface Cell {
  letter: string | null;
  userLetter: string | null;
  isBlack: boolean;
  clueNumber?: number;
  isCorrect?: boolean | null;
}

export interface Clue {
  number: number;
  text: string;
  answer: string;
  row: number;
  col: number;
  direction: 'across' | 'down';
}

export const cluesList: Clue[][] = [
[
  { number: 1, text: "Led the Israelites out of Egypt", answer: "MOSES", row: 0, col: 2, direction: 'across' },
  { number: 2, text: "Built the ark", answer: "NOAH",   row: 0, col: 1, direction: 'down' },
  { number: 3, text: "Defeated Goliath", answer: "DAVID", row: 2, col: 0, direction: 'across' },
],
  [
    { number: 1, text: "He was thrown into the lions’ den", answer: "DANIEL", row: 0, col: 0, direction: 'across' },
    { number: 2, text: "Parted the Red Sea", answer: "MOSES", row: 1, col: 2, direction: 'down' },
    { number: 3, text: "He betrayed Jesus", answer: "JUDAS", row: 3, col: 0, direction: 'across' },
  ],
];
