/* eslint no-useless-escape: 0 */
/**
 * New file watcher
 */
// const _ = require('lodash');
// Const args = require('yargs');
const bacon = require('baconjs');
const reload = require('reload');
const chokidar = require('chokidar');
const log = require('./utils/log');
/**
 * @param {string} webroot path to watch
 * @param {object} app express app
 * @param {object} config for reload (optional)
 * @return {object} bacon instance for watch later
 */
module.exports = function(webroot, app, config = {}) {
  const reloadServer = reload(app, config);
  let watcher;
  let files = [];
  log('watching', webroot);
  // Start the watch files with Bacon wrapper
  const streamWatcher = bacon.fromBinder(sink => {
    watcher = chokidar.watch(webroot, {
      ignored: /(^|[\/\\])\../,
      ignoreInitial: true
    });
    watcher.on('all', (event, path) => {
      log('chokidar detect changed', event, path);
      sink({ event: event, path: path });
      return () => {
        watcher.close();
      };
    });
  });
  // Reactive
  return (
    streamWatcher
      //  .skipDuplicates(_.isEqual)
      //  .map('.path')
      .doAction(a => {
        log('action', a);
        files.push(a);
      })
      .debounce(300)
      .onValue(() => {
        if (files.length) {
          log('change event fired');
          reloadServer.reload();
          // Reset
          files = [];
        }
      })
  );
};
