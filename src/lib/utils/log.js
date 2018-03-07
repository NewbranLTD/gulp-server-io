/**
 * Log method wrapper, with checks if it should report or not
 */
const log = require('fancy-log');
const test = process.env.NODE_ENV === 'test';
const debug = process.env.DEBUG;
// Main
module.exports = function(...args) {
  if (!test && !debug) {
    Reflect.apply(log, args);
  }
};
