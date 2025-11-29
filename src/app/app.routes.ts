import { Routes } from '@angular/router';
import { SudokuComponent } from './sudoku/sudoku';
import { FortyThievesComponent } from './fortyThieves/forty-thieves.component';
import { GamesMenuComponent } from './gamesMenu/menu';
import { ConnectDotsComponent } from './connectDots/connect-dots.component';
import { CrosswordComponent } from './crossword/crossword.component';

export const routes: Routes = [
    { path: '', component: GamesMenuComponent },
  { path: 'sudoku', component: SudokuComponent },
  { path: 'forty-thieves', component: FortyThievesComponent },
  { path: 'connect-dots', component: ConnectDotsComponent },
  { path: 'crossword', component: CrosswordComponent}
];


