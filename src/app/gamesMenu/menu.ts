import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { dailyVersesESV } from '../vertses';
import { Router } from '@angular/router';
import { AdsComponent } from '../components/ads/ads.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DonateComponent } from '../components/donate/donate.component';

@Component({
  selector: 'app-games-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, AdsComponent, DonateComponent],
  templateUrl: './menu.html',
  styleUrls: ['./gamesMenu.css']
})
export class GamesMenuComponent implements OnInit {
    todaysVerse: string = '';
  constructor(private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    const dayIndex = Math.floor(Date.now() / 86400000) % dailyVersesESV.length;
    this.todaysVerse = dailyVersesESV[dayIndex];
  }

  goToGame(game: string) {
  switch (game) {
    case 'sudoku':
      this.router.navigate(['/sudoku']);
      break;
    case 'fortythieves':
      this.router.navigate(['/forty-thieves']);
      break;
    default:
      alert('Coming soon!');
      break;
  }
}

}

