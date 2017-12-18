/**
 * Since we need to include the gulp for testing
 * might as well export this back so the developer
 * don't need to add add it to the dependecies
 */
const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const streamWatcher = require('./src/lib/utils/stream-watcher');
// Re-export
exports.gulp = gulp;
exports.gulpUtil = gulpUtil;
exports.helmet = helmet;
exports.bodyParser = bodyParser;
exports.streamWatcher = streamWatcher;
exports.watcher = function(filePaths, callback, verbose = true, debounce = 300) {
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
