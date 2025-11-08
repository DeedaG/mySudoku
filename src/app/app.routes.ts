import { Routes } from '@angular/router';
import { SudokuComponent } from './sudoku/sudoku';
import { GamesMenuComponent } from './gamesMenu/menu';
import { FortyThievesComponent } from './fortyThieves/fortyThievesComponent';

export const routes: Routes = [
    { path: '', component: GamesMenuComponent },
  { path: 'sudoku', component: SudokuComponent },
  { path: 'forty-thieves', component: FortyThievesComponent }
];


