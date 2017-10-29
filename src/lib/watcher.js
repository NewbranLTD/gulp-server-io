/* eslint no-useless-escape: 0 */
/**
 * New file watcher
 */
const _ = require('lodash');
const chokidar = require('chokidar');
const bacon = require('baconjs');
const tinyLr = require('./tiny-lr-setup');
// Export
module.export = function(config) {
  let watcher;
  let start = false;
  const tinyLrSrv = tinyLr(config);
  tinyLrSrv.listen(config.livereload.port, config.host);
  // Start the watch files with Bacon wrapper
  const streamWatcher = bacon.fromBinder(sink => {
    watcher = chokidar.watch(root, {
      ignored: /(^|[\/\\])\../
    });
    watcher.on('all', (event, path) => {
      sink({ event: event, path: path });
      return () => {
        watcher.unwatch(root);
      };
    });
  });
  // Reactive
  streamWatcher
    .skipDuplicates(_.isEqual)
    .map('.path')
    .scan([], (a, b) => {
      a.push(b);
      return a;
    })
    .debounce(300)
    .onValue(files => {
      if (!start) {
        // Skip the first one
        start = true;
        return;
      }
      tinyLrSrv.changed({
        body: {
          files: files
        }
      });
    });
};
