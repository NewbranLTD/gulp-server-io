/* eslint no-useless-escape: 0 */
/**
 * New file watcher
 */
const chalk = require('chalk');
const bacon = require('baconjs');
const reload = require('reload');
const chokidar = require('chokidar');
const logutil = require('./utils/log');
/**
 * @param {array} filePaths the path to the folder get watch
 * @param {object} app express app
 * @param {object} config for reload (optional)
 * @return {object} bacon instance for watch later
 */
module.exports = function(filePaths, app, config = {}) {
  const reloadServer = reload(app, config);
  const verbose = config.verbose;
  let files = [];
  // Start the watch files with Bacon wrapper
  const streamWatcher = bacon.fromBinder(sink => {
    filePaths.forEach(file => {
      const webroot = file.path;
      if (verbose) {
        logutil(chalk.white('[Watcher]'), webroot);
      }
      let watcher = chokidar.watch(webroot, {
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
  });
  // Reactive
  return streamWatcher
    .doAction(a => files.push(a))
    .debounce(300)
    .onValue(() => {
      if (files.length) {
        if (verbose) {
          logutil(chalk.white('[Watcher]'), 'File changed');
          files.forEach(f => {
            logutil(chalk.yellow(f.event), chalk.yellow(f.path));
          });
        }
        reloadServer.reload();
        // Reset
        files = [];
      }
    });
};
