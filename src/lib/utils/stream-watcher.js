/* eslint no-useless-escape: 0 */
/**
 * Seperate the watch method and report it
 * useful for other
 */
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const bacon = require('baconjs');
const chokidar = require('chokidar');
const debug = require('debug')('gulp-webserver-io:stream-watcher');
// Our tools
const logutil = require('./log');
const { toArray } = require('./helper');
let watcher;
/**
 * Make sure to pass directories to this method
 * @20180322 Add if this is not a directory then we resolve the file path directory
 * @param {array} filePaths array of directories
 * @return {array} fixed paths
 */
const ensureIsDir = filePaths => {
  const paths = toArray(filePaths);
  return _.compact(
    paths.map(d => {
      /* If (d.cwd) {
        return d.cwd;
      } */
      return fs.existsSync(d)
        ? fs.lstatSync(d).isDirectory()
          ? d
          : path.dirname(d)
        : false;
    })
  );
};

/**
 * Watch folder method
 * @param {array} filePaths to watch
 * @param {boolean} verbose to output or not
 * @return {function} bacon unwatch method
 */
module.exports = function(filePaths, verbose) {
  debug('[verbose]', verbose);
  const directories = ensureIsDir(filePaths);
  if (directories.length) {
    debug('[directories]', directories);
    return bacon.fromBinder(sink => {
      directories.forEach(dir => {
        debug('[Watcher][directory]', dir);
        if (verbose) {
          logutil(chalk.white('[Watcher][directory]'), dir);
        }
        watcher = chokidar.watch(dir, {
          ignored: /(^|[\/\\])\../,
          ignoreInitial: true
        });
        watcher.on('all', (event, path) => {
          debug('[Watcher][on]', event, path);
          if (verbose) {
            logutil(chalk.white('[Watcher][on]', event, path));
          }
          sink({ event: event, path: path });
          return () => {
            watcher.close();
          };
        });
      });
    });
  }
  // Now we have the ensureIsDir fn so this should never get throw
  throw new Error('[streamWatcher] You must pass an array of directory to this function');
};
