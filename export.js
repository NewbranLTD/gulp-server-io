/**
 * Since we need to include the gulp for testing
 * might as well export this back so the developer
 * don't need to add add it to the dependecies
 */
const gulp = require('gulp');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const streamWatcher = require('./src/lib/utils/stream-watcher');
const { fileWatcher } = require('./src/lib/utils/helper');
// Re-export
module.exports = {
  gulp,
  helmet,
  bodyParser,
  streamWatcher,
  fileWatcher
};
