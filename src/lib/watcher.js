/* eslint no-useless-escape: 0 */
/**
 * New file watcher
 */
// const _ = require('lodash');
// Const args = require('yargs');
const chalk = require('chalk');
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
  const verbose = config.reload.verbose;
  let watcher;
  let files = [];
  if (verbose) {
    log(chalk.white('[Watcher]'), webroot);
  }
  // Start the watch files with Bacon wrapper
  const streamWatcher = bacon.fromBinder(sink => {
    watcher = chokidar.watch(webroot, {
      ignored: /(^|[\/\\])\../,
      ignoreInitial: true
    });
    watcher.on('all', (event, path) => {
      sink({ event: event, path: path });
      return () => {
        watcher.close();
      };
    });
  });
  // Reactive
  return streamWatcher
    .doAction(a => {
      log('action', a);
      files.push(a);
    })
    .debounce(300)
    .onValue(() => {
      if (files.length) {
        if (verbose) {
          log(chalk.white('[Watcher]'), 'File changed');
          files.forEach(f => {
            log(chalk.yellow(f.event), chalk.yellow(f.path));
          });
        }
        reloadServer.reload();
        // Reset
        files = [];
      }
    });
};
