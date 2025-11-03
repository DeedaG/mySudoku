import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AdsenseService } from '../../services/adsense.service';

@Component({
  selector: 'app-ads',
  standalone: true,
  template: `
    <ins class="adsbygoogle"
      style="display:block"
      data-ad-format="auto"
      data-full-width-responsive="true">
    </ins>
  `
})
export class AdsComponent implements OnInit {
  constructor(
    private ads: AdsenseService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.ads.loadAdsense();
    }
  }
}

