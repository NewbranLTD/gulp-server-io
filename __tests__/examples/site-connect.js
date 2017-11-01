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
const scriptInject = require('../../src/lib/script-inject');

// Inject the livereload scripts
app.use(
  scriptInject({
    snippet: `<script type="text/javascript" src="/reload/reload.js"></script>`
  })
);

// Cache-Control: no-cache, must-revalidate
app.use(
  serveStatic(root, {
    index: ['index.html', 'index.htm']
  })
);

// Create server
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
let files = [];
streamWatcher
  .skipDuplicates(_.isEqual)
  .map('.path')
  .doAction(f => files.push(f))
  .debounce(300)
  .onValue(files => {
    if (files.length) {
      console.log('change event fired', files);
      tinyLrSrv.changed({
        body: {
          files: files
        }
      });
      files = [];
    }
  });
