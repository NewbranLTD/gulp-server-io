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
/**
 * Make sure to pass directories to this method
 * @20180322 Add if this is not a directory then we resolve the file path directory
 */
const ensureIsDir = filePaths => {
  console.log(toArray, typeof toArray);
  const paths = toArray(filePaths);
  return _.compact(
    paths.map(d => {
      if (d.cwd) {
        return d.cwd;
      }
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
  // Now we have the ensureIsDir fn so this should never get throw
  throw new Error('[streamWatcher] You must pass an array of directory to this function');
};
