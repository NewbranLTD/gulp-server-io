/* eslint no-useless-escape: 0 */
/**
 * Seperate the watch method and report it
 * useful for other
 */
const chalk = require('chalk');
const bacon = require('baconjs');
const chokidar = require('chokidar');
const debug = require('gulp-webserver-io:stream-watcher');
// Our tools
const logutil = require('./log');
const { toArray } = require('./helper');
/**
 * Watch folder method
 * @param {array} filePaths to watch
 * @param {boolean} verbose to output or not
 * @return {function} bacon method
 */
module.exports = function(filePaths, verbose) {
  return bacon.fromBinder(sink => {
    toArray(filePaths).forEach(file => {
      const webroot = file.path;
      debug('[Watcher][webroot]', webroot);
      if (verbose) {
        logutil(chalk.white('[Watcher]'), webroot);
      }
      let watcher = chokidar.watch(webroot, {
        ignored: /(^|[\/\\])\../,
        ignoreInitial: true
      });
      watcher.on('all', (event, path) => {
        debug('[Watcher][on]', event, path);
        sink({ event: event, path: path });
        return () => {
          watcher.close();
        };
      });
    });
  });
};
