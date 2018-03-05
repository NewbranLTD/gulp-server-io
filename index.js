/**
 * Top level export method
 * @TODO export a gulp version with the gulp-inject
 * otherwise just export the method
 */
const gulpServerIo = require('./src');
// Main
module.exports = function(options = {}) {
  return gulpServerIo(options);
};
