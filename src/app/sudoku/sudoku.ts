import { Component } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdsComponent } from '../components/ads/ads.component';
import { DonateComponent } from "../components/donate/donate.component";
import { Inject, PLATFORM_ID } from '@angular/core'
import confetti from 'canvas-confetti';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sudoku',
  standalone: true,
  imports: [CommonModule, FormsModule, AdsComponent, DonateComponent],
  templateUrl: './sudoku.html',
  styleUrls: ['./sudoku.css']
})
export class SudokuComponent {

  valuesGrid: (number | '')[][] = [];
  notesGrid: number[][][] = [];
  fixed: boolean[][] = [];
  errors: boolean[][] = [];
  solution: number[][] = [];
  solved = false;
  difficulty = 'medium';
  notesMode = false;
  startTime!: number;
  elapsedMs = 0;
  intervalId: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, 
  private router: Router) {}

  ngOnInit() {
    this.loadDifficulty();
    this.newPuzzle();
  }

  newPuzzle() {
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
    this.valuesGrid = puzzleGrid.map(row => row.map(num => num === 0 ? '' : num));
    this.notesGrid = Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => [])
    );
    this.fixed = puzzleGrid.map(row => row.map(num => num !== 0));
    this.errors = Array.from({ length: 9 }, () => Array(9).fill(false));
    this.solved = false;
    this.startTimer();
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

clearCell(row: number, col: number) {
  this.valuesGrid[row][col] = '';
  if (!this.fixed[row][col]) {
    this.notesGrid[row][col] = [];
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
        return false;
      }
    }
  }
  return true;
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

 onCellInput(i: number, j: number, input: KeyboardEvent) {
  if(this.notesMode) return;

  const num = Number(input);
  this.valuesGrid[i][j] = (num >= 1 && num <= 9) ? num : '';
  this.validateCell(i, j);
}

onNoteKey(e: KeyboardEvent, i:number, j:number) {
  if (!this.notesMode) return;
  const d = Number(e.key);
  if (d>=1 && d<=9) {
    e.preventDefault();       // DO NOT let it type into box
    this.toggleNote(i,j,d);
  }
}

toggleNote(i: number, j: number, d: number) {
  const notes = this.notesGrid[i][j]; // example: [1,3,7]
  const idx = notes.indexOf(d);
  if (idx === -1) {
    notes.push(d);      // not there → ADD
  } else {
    notes.splice(idx,1) // is there → REMOVE
  }
  notes.sort((a,b)=>a-b); // keep visually ordered
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
    if(!this.notesMode && !this.fixed[i][j]){
      this.valuesGrid[i][j] = '';
    }
  }

hasConflict(row: number, col: number, val: number): boolean {
  for (let i = 0; i < 9; i++) {
    if ((i !== col && this.valuesGrid[row][i] === val) ||
        (i !== row && this.valuesGrid[i][col] === val)) return true;
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if ((r !== row || c !== col) && this.valuesGrid[r][c] === val) return true;
    }
  }

  return false;
}


  isSolved(): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = this.valuesGrid[r][c];
      if (v === '' || v !== this.solution[r][c]) return false;
    }
  }
  this.celebrate();
  this.onSolved();
  return true;
}

  celebrate() {

      confetti({
      particleCount: 100,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
  }


  startTimer() {
    this.startTime = Date.now();
    this.intervalId = setInterval(() => {
      this.elapsedMs = Date.now() - this.startTime;
    }, 1000); // update every sec
  }

  stopTimer() {
    clearInterval(this.intervalId);
  }

  // you can call this when puzzle is solved
  onSolved() {
    this.stopTimer();
    console.log("final time (ms):", this.elapsedMs);
  }

  // optional = convert ms to mm:ss
  get formattedTime(): string {
    const sec = Math.floor(this.elapsedMs / 1000);
    const mm = Math.floor(sec / 60).toString().padStart(2, '0');
    const ss = (sec % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  }

  trackByIndex(index: number, _item: any): number { return index; }

   goBack(){
    this.router.navigateByUrl('/');
   }

  validateCell(row: number, col: number) {
  const val = this.valuesGrid[row][col];

  // empty or non-number
  if (val === '' || typeof val !== 'number') {
    this.errors[row][col] = false;
    this.solved = false;
    return;
  }

  // wrong number vs solution
  if (val !== this.solution[row][col]) {
    this.errors[row][col] = true;
    this.valuesGrid[row][col] = '';
    return;
  }

  // correct number
  this.errors[row][col] = this.hasConflict(row, col, val);
  if (!this.errors[row][col]) {
    // CLEAN NOTES when correct
    this.notesGrid[row][col] = [];
  }

  this.solved = this.isSolved();
}
}




