'use strict';
const open = require('opn');
const path = require('path');
const http = require('http');
const chalk = require('chalk');

const connect = require('connect');
const serveStatic = require('serve-static');

const chokidar = require('chokidar');
const bacon = require('baconjs');
// const tinyLr = require('tiny-lr');

const root = path.join(__dirname, '..', 'fixtures', 'app');
const app = connect();
// Cache-Control: no-cache, must-revalidate
app.use(
  serveStatic(root, {
    index: ['index.html', 'index.htm']
  })
);


// create server 
const server = http.createServer(app);

server.listen(3001, () => {
  console.log(chalk.yellow('Example server start @ 3001'));
  open('http://localhost:3001');
});
let watcher;
// start the watch files with Bacon wrapper
const streamWatcher = bacon.fromBinder( sink => {
  watcher = chokidar.watch(root, {ignored: /(^|[\/\\])\../});
  watcher.on('all', (event, path) => {
    // problem when this is inited, several add / addDir events are fire
    // see if there is a way to debounce this all together
    sink({event: event, path: path});
    return () => {
      watcher.unwatch(root);
    }
  });
});

streamWatcher.log();
