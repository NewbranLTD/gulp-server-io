/* eslint no-useless-escape: 0 */
'use strict';
const open = require('opn');
const path = require('path');
const http = require('http');
const chalk = require('chalk');

const connect = require('connect');
const serveStatic = require('serve-static');

const chokidar = require('chokidar');
const bacon = require('baconjs');
const _ = require('lodash');
const tinyLr = require('tiny-lr');

const root = path.join(__dirname, '..', 'fixtures', 'app');
const app = connect();
const tinyLrSrv = tinyLr();
const livereloadFn = require('../../src/lib/livereload.js');
// Cache-Control: no-cache, must-revalidate
app.use(
  serveStatic(root, {
    index: ['index.html', 'index.htm']
  })
);
app.use(livereloadFn());
// Inject the livereload scripts

// create server
const server = http.createServer(app);

server.listen(3001, () => {
  console.log(chalk.yellow('Example server start @ 3001'));
  open('http://localhost:3001');
});
let watcher;
// Start the watch files with Bacon wrapper
const streamWatcher = bacon.fromBinder(sink => {
  watcher = chokidar.watch(root, { ignored: /(^|[\/\\])\../ });
  watcher.on('all', (event, path) => {
    sink({ event: event, path: path });
    return () => {
      watcher.unwatch(root);
    };
  });
});

streamWatcher
  .skipDuplicates(_.isEqual)
  .map('.path')
  .scan([], (a, b) => {
    a.push(b);
    return a;
  })
  .debounce(300)
  .subscribe(files => {
    // Console.log('files', f);
    tinyLrSrv.changed({
      body: {
        files: files
      }
    });
  });
