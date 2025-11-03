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

loadAdsense() {
    if (!isPlatformBrowser(this.platformId)) {
      return; // <-- stop here on server
    }

    const script = document.createElement('script');
    script.async = true;

    // replace YOUR_PUB_ID
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=YOUR_PUB_ID';
    script.crossOrigin = 'anonymous';

    document.head.appendChild(script);

    // after script load call adsbygoogle
    script.onload = () => {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    };
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



