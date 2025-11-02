import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-donate',
  standalone: true,
  imports: [CommonModule],
  template: `
    <a class="donate-button" href="https://paypal.me/christigames?country.x=US&locale.x=en_US"
    target="_blank" rel="noopener">
      ❤️ Donate with PayPal
    </a>
  `,
  styleUrls: ['./donate.component.css']
})
export class DonateComponent {}
