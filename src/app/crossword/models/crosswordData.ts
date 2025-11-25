export interface Cell {
  letter: string | null;      // Correct letter
  userLetter: string | null;  // Player input
  isBlack: boolean;
  clueNumber?: number;
}

export interface Clue {
  number: number;
  text: string;
  answer: string;
  row: number;
  col: number;
  direction: 'across' | 'down';
}

// Sample clues
export const clues: Clue[] = [
  { number: 1, text: "Led the Israelites out of Egypt", answer: "MOSES", row: 0, col: 0, direction: 'across' },
  { number: 2, text: "Built the ark", answer: "NOAH", row: 0, col: 1, direction: 'down' },
  { number: 3, text: "Defeated Goliath", answer: "DAVID", row: 2, col: 0, direction: 'across' },
];
