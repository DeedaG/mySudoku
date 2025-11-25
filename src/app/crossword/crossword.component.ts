import { Component, OnInit } from '@angular/core';
import { Cell, Clue, clues } from './models/crosswordData';

@Component({
  selector: 'app-crossword',
  templateUrl: './crossword.component.html',
  styleUrls: ['./crossword.component.css']
})
export class CrosswordComponent implements OnInit {
  gridSize = 7; // 7x7 grid for simplicity
  grid: Cell[][] = [];
  clues: Clue[] = clues;

  selectedCell: { row: number, col: number } | null = null;

  ngOnInit(): void {
    this.initGrid();
    this.placeClues();
  }

  initGrid() {
    for (let i = 0; i < this.gridSize; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.gridSize; j++) {
        this.grid[i][j] = { letter: null, userLetter: null, isBlack: true };
      }
    }
  }

  placeClues() {
    this.clues.forEach(clue => {
      const { row, col, answer, direction, number } = clue;
      for (let i = 0; i < answer.length; i++) {
        let r = row;
        let c = col;
        if (direction === 'across') c += i;
        else r += i;

        this.grid[r][c].isBlack = false;
        this.grid[r][c].letter = answer[i];
        if (i === 0) this.grid[r][c].clueNumber = number;
      }
    });
  }

  selectCell(row: number, col: number) {
    this.selectedCell = { row, col };
  }

  isSelected(row: number, col: number) {
    return this.selectedCell?.row === row && this.selectedCell?.col === col;
  }
}
