import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Cell, Clue, cluesList } from './models/crosswordData';
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


  constructor(@Inject(PLATFORM_ID) private platformId: Object, 
  private router: Router) {}

  ngOnInit(): void {
    this.selectDailyPuzzle();
    this.initGrid();
    this.placeClues();
  }

    selectDailyPuzzle() {
      const today = new Date();
      const index = today.getDate() % cluesList.length;
      this.clues = cluesList[index];
      if(this.elapsedMs == 0){
        this.startTimer();
      }
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
      for (let i = 0; i < this.gridSize; i++) {
        for (let j = 0; j < this.gridSize; j++) {
          const cell = this.grid[i][j];
          if (!cell.isBlack && cell.userLetter) {
            cell.isCorrect = (cell.userLetter.toUpperCase() === cell.letter);
          } else {
            cell.isCorrect = null; // no input yet
          }
        }
      }
    }

    
}
