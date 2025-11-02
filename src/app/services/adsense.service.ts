declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdsenseService {

  private scriptLoaded = false;
  private scriptLoadingPromise: Promise<void> | null = null;

  loadAdsense(): Promise<void> {
    if (this.scriptLoaded) return Promise.resolve();
    if (this.scriptLoadingPromise) return this.scriptLoadingPromise;

    this.scriptLoadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.setAttribute('data-ad-client', 'ca-pub-YOUR_AD_CLIENT_ID'); // replace with your client ID
      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };
      script.onerror = () => reject('AdSense script failed to load');
      document.head.appendChild(script);
    });

    return this.scriptLoadingPromise;
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
