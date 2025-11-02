// src/app/components/ads/ads.component.ts
import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdsenseService } from '../../services/adsense.service';

@Component({
  selector: 'app-ads',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-YOUR_AD_CLIENT_ID"
         data-ad-slot="YOUR_AD_SLOT_ID"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
  `
})
export class AdsComponent implements AfterViewInit {
  constructor(private adsense: AdsenseService) {}

  ngAfterViewInit(): void {
    this.adsense.loadAdsense().then(() => {
      this.adsense.refreshAds();
    }).catch(console.error);
  }
}
