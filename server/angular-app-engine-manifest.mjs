
export default {
  basePath: 'https://DeedaG.github.io/mySudoku',
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
