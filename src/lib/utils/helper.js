/* eslint-disable */
'use strict';
/**
 * Move some of the functions out of the main.js to reduce the complexity
 */
const chalk = require('chalk');
const logutil = require('./log.js');

/**
 * create a random number between two values, for creating a random port number
 * @param {int} min
 * @param {int} max
 * @return {int} port
 */
exports.getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * @param {mixed} opt
 * @return {boolean} result
 */
const isString = function (opt) {
  return (typeof opt === 'string');
};

/**
 * Set headers
 * @param {object} config
 * @param {string} urlToOpen
 */
exports.setHeaders = (config, urlToOpen) => {
  return res => {
    if (isString(config.headers.origin) || (urlToOpen && urlToOpen.indexOf('http') === 0)) {
      res.setHeader(
        'Access-Control-Allow-Origin',
        isString(config.headers.origin) || (isString(urlToOpen) || '*')
      );
    }
    res.setHeader(
      'Access-Control-Request-Method',
      isString(config.headers.requestMethod) || '*'
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      isString(config.headers.allowMethods) || 'GET , POST , PUT , DELETE , OPTIONS'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      isString(config.headers.allowHeaders) || 'Content-Type, Authorization, Content-Length, X-Requested-With'
    );
  };
};

// -- EOF --
