/* eslint-disable */
'use strict';
/**
 * Move some of the functions out of the main.js to reduce the complexity
 */
const _ = require('lodash');
const chalk = require('chalk');
const express = require('express');
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
 * @return {function} middleware
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
/**
 * @param {string} webroot path to where the files are
 * @param {object} config the main config
 * @param {string} urlToOpen (optional) @TODO
 * @return {function} middleware
 */
exports.serveStatic = (webroot, config, urlToOpen = '') => {
  // @TODO configure the directoryListing option here
  config.staticOptions = _.merge(
    {
      setHeaders: exports.setHeader(config, urlToOpen),
      index: config.indexes
    },
    config.staticOptions
  );
  return express.static(
    webroot, config.staticOptions
  );
};
