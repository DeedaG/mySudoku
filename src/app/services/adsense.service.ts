declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

import { Injectable , Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class AdsenseService {

  private scriptLoaded = false;
  private scriptLoadingPromise: Promise<void> | null = null;

constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

ngAfterViewInit() {
  setTimeout(() => {
    try {
      // important: only push *here*
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch(e){}
  });
}


loadAdsense() {
  if (!isPlatformBrowser(this.platformId)) return;

  if (this.scriptLoaded) return;

  this.scriptLoaded = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5670541810503551';
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
}

  refreshAds() {
    if (window.adsbygoogle) {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        console.error('AdSense push error', e);
      }
    } else {
      console.warn('adsbygoogle not ready yet');
    }
  }
}



