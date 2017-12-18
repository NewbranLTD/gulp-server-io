/* eslint no-useless-escape: 0 */
/**
 * New file watcher
 */
const chalk = require('chalk');
const logutil = require('./utils/log');
const streamWatcher = require('./utils/stream-watcher');
/**
 * @20171112 - change where we start the reload server
 * @param {array} filePaths the path to the folder get watch
 * @param {object} reloadServer
 * @return {object} bacon instance for watch later
 */
module.exports = function(filePaths, reloadServer, config) {
  const verbose = config.verbose;
  let files = [];
  // Reactive
  return streamWatcher(filePaths, verbose)
    .doAction(f => files.push(f))
    .debounce(300) // Should allow config to change
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
