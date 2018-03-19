/* eslint no-useless-escape: 0 */
/**
 * Seperate the watch method and report it
 * useful for other
 */
const fs = require('fs');
const chalk = require('chalk');
const bacon = require('baconjs');
const chokidar = require('chokidar');
const debug = require('debug')('gulp-webserver-io:stream-watcher');
// Our tools
const logutil = require('./log');
const { toArray } = require('./helper');

// Make sure to pass directories to this method
const ensureIsDir = filePaths => {
  return toArray(filePaths).filter(f => fs.lstatSync(f).isDirectory());
};

/**
 * Watch folder method
 * @param {array} filePaths to watch
 * @param {boolean} verbose to output or not
 * @return {function} bacon method
 */
module.exports = function(filePaths, verbose) {
  const directories = ensureIsDir(filePaths);
  if (directories.length) {
    return bacon.fromBinder(sink => {
      directories.forEach(dir => {
        debug('[Watcher][webroot]', dir);
        if (verbose) {
          logutil(chalk.white('[Watcher]'), dir);
        }
        let watcher = chokidar.watch(dir, {
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
  }
  throw new Error('[streamWatcher] You must pass diretory to this function');
};
