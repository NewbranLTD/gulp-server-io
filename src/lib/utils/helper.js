/* eslint-disable */
'use strict';
/**
 * Move some of the functions out of the main.js to reduce the complexity
 */
const _ = require('lodash');
const path = require('path');
const express = require('express');
const logutil = require('./log.js');
/**
 * create a random number between two values, for creating a random port number
 * @param {int} min
 * @param {int} max
 * @return {int} port
 */
const getRandomInt = function (min, max) {
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
const setHeaders = (config, urlToOpen) => {
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
  let etag = true;
  if (config.development === false) {
    const _root = process.cwd();
    if (webroot === path.join(_root, 'app')) {
      webroot = path.join(_root, 'dest');
    }
  } else {
    etag = false;
  }
  // @TODO configure the directoryListing option here
  const staticOptions = _.merge(
    {
      setHeaders: setHeaders(config, urlToOpen),
      index: config.indexes,
      etag: etag
    },
    config.staticOptions
  );
  return express.static(webroot, staticOptions);
};
/**
 * directory listing
 */
exports.directoryListing = (dir) => {
  return express.directory(dir);
};

// export for other use
exports.setHeaders = setHeaders;
exports.getRandomInt = getRandomInt;

/**
 * delay proxy
 * @param {string} originalUrl (url to delay)
 * @param {int} delayReqTime time to delay when request in ms
 * @param {int} delayResTime time to delay when response in ms
 * @return {function} middleware to use: app.use(url, proxyDelay, myProxy);
 */
exports.proxyDelay = function(originalUrl, delayReqTime, delayResTime) {
  return function (req, res, next) {
    if (req.originalUrl === originalUrl) {
      // Delay request by 2 seconds
      setTimeout(next, delayReqTime);
      // Delay response completion by 5 seconds
      const endOriginal = res.end;
      res.end = function (...args) {
        setTimeout(function () {
          endOriginal.apply(res, args);
        }, delayResTime);
      };
    } else {
      next();
    }
  }
};
