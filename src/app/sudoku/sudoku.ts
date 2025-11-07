import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdsComponent } from '../components/ads/ads.component';
import { DonateComponent } from "../components/donate/donate.component";
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';


@Component({
  selector: 'app-sudoku',
  standalone: true,
  imports: [CommonModule, FormsModule, AdsComponent, DonateComponent],
  templateUrl: './sudoku.html',
  styleUrls: ['./sudoku.css']
})
export class SudokuComponent {
  grid: CellData[][] = [];
  emptyCell: string = '';
  fixed: boolean[][] = [];
  errors: boolean[][] = [];
  solved = false;
  private solution: number[][] = [];
  difficulty = 'medium'; // default
  notesMode = false;
  @Inject(PLATFORM_ID) private platformId: Object = {};

  constructor() {
  }

  ngOnInit() {
    this.loadDifficulty();
    this.grid = Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => ({
        value: '',
        notes: []
      }))
    );

    this.newPuzzle(); // initial fill
  }


  newPuzzle() {
    this.solved = false;

    const fullGrid = this.generateFullGrid();
    this.solution = fullGrid.map(row => [...row]);

    let blanks = 40; // default

    switch (this.difficulty) {
      case 'easy': blanks = 30; break;
      case 'medium': blanks = 40; break;
      case 'hard': blanks = 55; break;
      case 'evil': blanks = 65; break;
    }

    const puzzleGrid = this.createPuzzle(fullGrid, blanks);
    this.grid = puzzleGrid.map(row =>
        row.map(num => ({
          value: num === 0 ? '' : num,
          notes: []
        }))
      );

    this.fixed = puzzleGrid.map(row => row.map(num => num !== 0));
    this.errors = Array.from({ length: 9 }, () => Array(9).fill(false));
  }

  loadDifficulty() {
  if (isPlatformBrowser(this.platformId)) {
    const diff = localStorage.getItem('difficulty');
    if (diff) this.difficulty = diff;
    }
  }

saveDifficulty() {
  if (isPlatformBrowser(this.platformId)) {
    localStorage.setItem('difficulty', this.difficulty);
  }
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

  onDifficultyChange() {
    this.saveDifficulty();     // persist
    this.newPuzzle();          // regenerate board immediately
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

  toggleNotes() {
    this.notesMode = !this.notesMode;
  }

  onCellInput(i: number, j: number, event: any)  {
    const v = event;
    if (this.notesMode) {
      const d = Number(v);
      const cellNotes = this.grid[i][j].notes;

      if (!cellNotes) this.grid[i][j].notes = [];
      // toggle note
      if (!cellNotes.includes(d))
      {
        this.grid[i][j].notes = [...cellNotes, d];
      } else {
        var updated = cellNotes.splice(j,1);
        this.grid[i][j].notes = updated;
      }
      this.grid[i][j].value = Number(0);
      return;
    } else {
      this.grid[i][j].value = Number(v);
      this.errors[i][j] = this.solution[i][j] != Number(v);
      this.validateCell(i,j);
    }
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
    if ( event.key === 'ArrowUp' || event.key === 'ArrowDown') event.preventDefault();
  }

  onWheel(event: WheelEvent) { event.preventDefault(); }

  onCellTap(i: number, j: number) {
  if (this.notesMode) {
    // delete main value, keep notes as-is
    this.grid[i][j].value = '';
  } else {
    // delete value normally
    this.grid[i][j].value = '';
  }
}


  hasConflict(row: number, col: number, val: number): boolean {
    for (let i = 0; i < 9; i++) {
      if ((i !== col && this.grid[row][i].value === val) ||
          (i !== row && this.grid[i][col].value === val)) return true;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if ((r !== row || c !== col) && this.grid[r][c].value === val) return true;
      }
    }
    return false;
  }

  isSolved(): boolean {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const val = this.grid[i][j].value;
        if (val === 0 || val != "" && this.hasConflict(i, j, val)) return false;
      }
    }
    return true;
  }

  trackByIndex(index: number, _item: any): number { return index; }

  validateCell(row: number, col: number) {
    const val = Number(this.grid[row][col].value);

    if (val === 0 || !val || val < 1 || val > 9) {
      this.grid[row][col].value = '';
      this.errors[row][col] = false;
      this.solved = false;
      return;
    }

    // WRONG NUMBER vs solution
    if (val !== this.solution[row][col]) {
      this.errors[row][col] = true;
      this.grid[row][col].value = '';   // ← changed here
      return;
    }

    this.errors[row][col] = this.hasConflict(row, col, val);
    this.solved = this.isSolved();
  }
}



interface CellData {
  notes: number[]
  value: number | ''
}

