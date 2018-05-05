// Watchers method breakout from helper
const streamWatcher = require('./stream-watcher');
const _ = require('lodash');
/**
 * Watcher - moving back from the gulp.js export
 * Rename from watcher --> fileWatcher
 * @param {mixed} filePaths array of string
 * @param {function} callback function to execute when file change
 * @param {boolean} verbose param pass to the streamWatcher should show console.log or not
 * @param {int} debounce ms to determine when the callback should execute
 * @return {function} the streamWatcher terminate callback
 */
exports.fileWatcher = (filePaths, callback, verbose = true, debounce = 300) => {
  let files = [];
  return streamWatcher(filePaths, verbose)
    .doAction(f => files.push(f))
    .debounce(debounce)
    .onValue(() => {
      if (files.length) {
        callback(files);
        // Reset
        files = [];
      }
    });
};

/**
 * Wrapper for the serverReload option - this will run in it's own process
 * @TODO try to figure out how to run this in a different process to avoid too many watchers
 * @param {object} config we pass the options.serverReload here
 * @return {mixed} ps config.enable or false
 */
exports.erverReload = config => {
  if (config.enable && _.isFunction(config.callback)) {
    return exports.fileWatcher(
      config.dir,
      config.callback,
      config.config.verbose,
      config.config.debounce
    );
  }
  return () => {};
};
