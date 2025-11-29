import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Cell, Clue } from './models/crosswordData';
import { cluesList } from './models/generated_cluesList_365';
import confetti from 'canvas-confetti';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdsComponent } from '../components/ads/ads.component';

@Component({
  selector: 'app-crossword',
  templateUrl: './crossword.component.html',
  imports: [CommonModule, FormsModule, AdsComponent],
  styleUrls: ['./crossword.component.css']
})
export class CrosswordComponent implements OnInit {
  solved = false;
  startTime!: number;
  elapsedMs = 0;
  intervalId: any;
  gridSize = 7;
  grid: Cell[][] = [];
  clues: Clue[] = [];
  selectedCell: { row: number, col: number } | null = null;
  today: Date = new Date();
  todaysDate = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object, 
  private router: Router) {}

  ngOnInit(): void {
    this.todaysDate = this.today.toLocaleDateString();
    this.selectDailyPuzzle();
    this.initGrid();
    this.placeClues();
  }

    selectDailyPuzzle() {
      const today = new Date();
      const seed = today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate();
      const index = seed % cluesList.length;
      this.clues = cluesList[index];
      if (this.elapsedMs == 0) this.startTimer();
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

  isBlack(row: number, col: number): boolean {
    return this.grid[row][col].isBlack;
  }

  correct(row: number, col: number): boolean | null {
    return this.grid[row][col].isCorrect || null;
  }

  trackByIndex(index: number, _item: any): number {
    return index;
  }

   stopTimer() {
    clearInterval(this.intervalId);
  }

  // you can call this when puzzle is solved
  onSolved() {
    this.stopTimer();
  }

  // optional = convert ms to mm:ss
  get formattedTime(): string {
    const sec = Math.floor(this.elapsedMs / 1000);
    const mm = Math.floor(sec / 60).toString().padStart(2, '0');
    const ss = (sec % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  }

   startTimer() {
    this.startTime = Date.now();
    this.intervalId = setInterval(() => {
      this.elapsedMs = Date.now() - this.startTime;
    }, 1000); // update every sec
  }

   celebrate() {
  
        confetti({
        particleCount: 100,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
    }

     goBack(){
      this.router.navigateByUrl('/');
    }

  checkPuzzle() {
    // First, clear all correctness
    for (let row of this.grid) {
      for (let cell of row) {
        cell.isCorrect = null;
      }
    }

    // Check each clue as a whole
    for (const clue of this.clues) {
      const { row, col, answer, direction } = clue;

      let correctWord = true;

      for (let i = 0; i < answer.length; i++) {
        const r = row + (direction === 'down' ? i : 0);
        const c = col + (direction === 'across' ? i : 0);
        const cell = this.grid[r][c];

        if (!cell.userLetter || cell.userLetter.toUpperCase() !== answer[i]) {
          correctWord = false;
        }
        cell.isCorrect = false;
      }

      // If the whole word is correct, mark all cells green
      if (correctWord) {
        for (let i = 0; i < answer.length; i++) {
          const r = row + (direction === 'down' ? i : 0);
          const c = col + (direction === 'across' ? i : 0);
          this.grid[r][c].isCorrect = true;
        }
      }
    }
    this.solved = this.grid.every(row =>
      row.every(cell => cell.isBlack || cell.isCorrect === true)
    );
    if (this.solved) {
      this.stopTimer();
      this.celebrate();
    }
  }


    validateClues() {
  for (let puzzleIndex = 0; puzzleIndex < cluesList.length; puzzleIndex++) {
    const clues = cluesList[puzzleIndex];
    const grid: string[][] = Array.from({ length: this.gridSize },
      () => Array(this.gridSize).fill(null)
    );

    for (const clue of clues) {
      const { row, col, answer, direction, number } = clue;

      for (let i = 0; i < answer.length; i++) {
        let r = row + (direction === 'down' ? i : 0);
        let c = col + (direction === 'across' ? i : 0);

        if (r >= this.gridSize || c >= this.gridSize) {
          console.error(
            `❌ Puzzle ${puzzleIndex}, Clue ${number} goes out of bounds.`
          );
          continue;
        }

        if (grid[r][c] && grid[r][c] !== null && grid[r][c] !== answer[i]) {
          console.error(
            `❌ Puzzle ${puzzleIndex}, Clue ${number} conflicts at (${r},${c}).`
          );
        }

        grid[r][c] = answer[i];
      }
    }
  }

  console.log("Validation done.");
}

}
