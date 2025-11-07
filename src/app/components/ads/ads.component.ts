import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AdsenseService } from '../../services/adsense.service';

@Component({
  selector: 'app-ads',
  standalone: true,
  template: `
    <ins class="adsbygoogle"
     style="display:block; width:100%; height:250px;"
     data-ad-client="ca-pub-5670541810503551"
     data-ad-slot="xxxx"></ins>
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

