/**
 * Since we need to include the gulp for testing
 * might as well export this back so the developer
 * don't need to add add it to the dependecies
 */
const chalk = require('chalk');
const gulp = require('gulp');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const streamWatcher = require('./src/lib/utils/stream-watcher');

console.log(
  chalk.red('This file will be remove in the 1.4.0 final release! Please use'),
  chalk.yellow('gulp-server-io/export')
);

// Re-export
exports.gulp = gulp;
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
