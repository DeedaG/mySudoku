
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'https://DeedaG.github.io/mySudoku/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/mySudoku"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 466, hash: '23926ddadb76a0227e72d193346244eccd3ee70ff354654d4179309a4aa09b40', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 979, hash: '454d197fc4e0565f60d3229cb32990ec2650bc6e6afed706a8a97415d9fc0e4b', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 26363, hash: '04d639e948a4e58297eb15bf3df3cc3d5bb246de104d5c7b08572d56f747a6e6', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
