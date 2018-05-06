'use strict';
/**
 * Top level export method
 * @TODO export a gulp version with the gulp-inject
 * otherwise just export the method
 */
const gulpServerIo = require('./src');
const { createConfiguration } = require('./src/lib/options');
// Main
module.exports = function(options) {
  const config = createConfiguration(options);
  config.__processed__ = true;
  return gulpServerIo(config);
};
