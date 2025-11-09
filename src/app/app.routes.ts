import { Routes } from '@angular/router';
import { SudokuComponent } from './sudoku/sudoku';
import { FortyThievesComponent } from './fortyThieves/forty-thieves.component';
import { GamesMenuComponent } from './gamesMenu/menu';

export const routes: Routes = [
    { path: '', component: GamesMenuComponent },
  { path: 'sudoku', component: SudokuComponent },
  { path: 'forty-thieves', component: FortyThievesComponent }
];


