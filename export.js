/**
 * Since we need to include the gulp for testing
 * might as well export this back so the developer
 * don't need to add add it to the dependecies
 */
const gulp = require('gulp');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { fileWatcher } = require('./src/lib/utils/watchers');
// Re-export
module.exports = {
  gulp: gulp,
  helmet: helmet,
  bodyParser: bodyParser,
  fileWatcher: fileWatcher
};
