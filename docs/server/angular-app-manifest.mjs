
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/mySudoku/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/mySudoku"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 442, hash: 'a6276b14da551e9b39725e0231f5323b17fc61fa6b39e8120e6a703cfb1d7f22', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 955, hash: 'f0f02dc7ee5f8ad40d3f79ad1b42d24b55f08ef487cf14d84ac68f37dc365ba5', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 26339, hash: '0a9f2d000c90491b34b978b9659edd95a72650047d472b0d2b764a52c23a8cd8', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
