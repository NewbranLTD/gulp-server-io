/* eslint no-useless-escape: 0 */
/**
 * New file watcher
 */
const chalk = require('chalk');
const bacon = require('baconjs');

const chokidar = require('chokidar');
const logutil = require('./utils/log');
/**
 * @20171112 - change where we start the reload server
 * @param {array} filePaths the path to the folder get watch
 * @param {object} reloadServer
 * @return {object} bacon instance for watch later
 */
module.exports = function(filePaths, reloadServer, config) {
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
