import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SudokuComponent } from './sudoku/sudoku';
import { NgStyle } from '@angular/common';
import { GamesMenuComponent } from "./gamesMenu/menu";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SudokuComponent, NgStyle, GamesMenuComponent], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mySudoku');
}
