/* eslint-disable */

/**
 * create a random number between two values, for creating a random port number
 * @param {int} min
 * @param {int} max
 * @return {int} port
 */
exports.getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
