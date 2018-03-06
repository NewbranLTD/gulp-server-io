/* eslint no-useless-escape: 0 */
/**
 * New file watcher
 */
const chalk = require('chalk');
const logutil = require('./utils/log');
const streamWatcher = require('./utils/stream-watcher');
const defaultInterval = 300;
/**
 * @20171112 - change where we start the reload server
 * @param {array} filePaths the path to the folder get watch
 * @param {function} reloadServerFn should be just a method to call
 * @param {object} config pass extra configuration option
 * @return {object} bacon instance for watch later
 */
module.exports = function(filePaths, reloadServerFn, config) {
  const verbose = config.verbose;
  let files = [];
  // Reactive
  return streamWatcher(filePaths, verbose)
    .doAction(f => files.push(f))
    .debounce(config.interval || defaultInterval) // Should allow config to change
    .onValue(() => {
      if (files.length) {
        if (verbose) {
          logutil(chalk.white('[Watcher]'), 'File changed');
          files.forEach(f => {
            logutil(chalk.yellow(f.event), chalk.yellow(f.path));
          });
        }
        // New allow to pass as a function
        if (typeof reloadServerFn === 'function') {
          reloadServerFn();
        } else if (reloadServerFn && typeof reloadServerFn.reload === 'function') {
          reloadServerFn.reload();
        } else {
          logutil(
            chalk.red(
              'Could not call reload server, it must be a function or an object contain a reload function!'
            )
          );
        }
        // Reset
        files = [];
      }
    });
};
