/**
 * Top level export method
 * @TODO export a gulp version with the gulp-inject
 * otherwise just export the method
 */
const gulpServerIo = require('./src');
// Main
module.exports = function(options = {}) {
  /**
   * @TODO For injection with gulp-inject
   * I think we need to create this here
   */
  return gulpServerIo(options);
};
