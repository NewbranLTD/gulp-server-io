/**
 * Top level export method
 * @TODO export a gulp version with the gulp-inject
 * otherwise just export the method
 */
const gulpServerIo = require('./src');
const {
  defaultOptions,
  defaultProperties,
  enableMiddlewareShorthand
} = require('./src/lib/options');
// Main
module.exports = function(options = {}) {
  const config = enableMiddlewareShorthand(defaultOptions, options, defaultProperties);
  config.__processed__ = true;
  return gulpServerIo(config);
};
