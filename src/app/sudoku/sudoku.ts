import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdsComponent } from '../components/ads/ads.component';
import { DonateComponent } from "../components/donate/donate.component";

@Component({
  selector: 'app-sudoku',
  standalone: true,
  imports: [CommonModule, FormsModule, AdsComponent, DonateComponent],
  templateUrl: './sudoku.html',
  styleUrls: ['./sudoku.css']
})
export class SudokuComponent {
  grid: number[][] = [];
  fixed: boolean[][] = [];
  errors: boolean[][] = [];
  solved = false;
  private solution: number[][] = [];

  constructor() {
    this.newPuzzle();
  }

  newPuzzle() {
    this.solved = false;

   // Step 1: generate a full valid Sudoku solution
    const fullGrid = this.generateFullGrid();
    this.solution = fullGrid.map(row => [...row]); // save the solution

    // Step 2: remove some numbers to create the puzzle
    const puzzleGrid = this.createPuzzle(fullGrid, 40); // remove 40 cells

    this.grid = puzzleGrid.map(row => [...row]);
    this.fixed = puzzleGrid.map(row => row.map(num => num !== 0));
    this.errors = Array.from({ length: 9 }, () => Array(9).fill(false));
  }

  // Generate a full valid Sudoku solution
  generateFullGrid(): number[][] {
    const grid: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
    this.fillGrid(grid);
    return grid;
  }

  fillGrid(grid: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          const numbers = this.shuffle([...Array(9).keys()].map(n => n + 1));
          for (const num of numbers) {
            if (!this.hasConflictGrid(grid, row, col, num)) {
              grid[row][col] = num;
              if (this.fillGrid(grid)) return true;
              grid[row][col] = 0;
            }
          }
          return false; // no valid number found
        }
      }
    }
    return true; // all cells filled
  }

  // Remove 'count' numbers randomly to create a puzzle
  createPuzzle(grid: number[][], count: number): number[][] {
    const puzzle = grid.map(row => [...row]);
    let removed = 0;
    while (removed < count) {
      const r = Math.floor(Math.random() * 9);
      const c = Math.floor(Math.random() * 9);
      if (puzzle[r][c] !== 0) {
        puzzle[r][c] = 0;
        removed++;
      }
    }
    return puzzle;
  }

  // Check conflicts for a specific grid (used in generation)
  hasConflictGrid(grid: number[][], row: number, col: number, val: number): boolean {
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === val || grid[i][col] === val) return true;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (grid[r][c] === val) return true;
      }
    }
    return false;
  }

  shuffle(array: number[]): number[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') event.preventDefault();
  }

  onWheel(event: WheelEvent) { event.preventDefault(); }


  hasConflict(row: number, col: number, val: number): boolean {
    for (let i = 0; i < 9; i++) {
      if ((i !== col && this.grid[row][i] === val) ||
          (i !== row && this.grid[i][col] === val)) return true;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if ((r !== row || c !== col) && this.grid[r][c] === val) return true;
      }
    }
    return false;
  }

  isSolved(): boolean {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const val = this.grid[i][j];
        if (val === 0 || this.hasConflict(i, j, val)) return false;
      }
    }
    return true;
  }

  trackByIndex(index: number, _item: any): number { return index; }

// 👇 modify validateCell to also check against the solution
  validateCell(row: number, col: number) {
    const val = Number(this.grid[row][col]);

    // Ignore empty or invalid input
    if (!val || val < 1 || val > 9) {
      this.grid[row][col] = 0;
      this.errors[row][col] = false;
      this.solved = false;
      return;
    }

    // 1️⃣ First, ensure the player typed the correct number for this square
    if (val !== this.solution[row][col]) {
      this.errors[row][col] = true;
      this.grid[row][col] = 0; // clear wrong number
      return;
    }

 // 2️⃣ Then check for general Sudoku conflicts
    this.errors[row][col] = this.hasConflict(row, col, val);

    // 3️⃣ Finally check if the board is solved
    this.solved = this.isSolved();
  }
}



