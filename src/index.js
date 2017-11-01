/* eslint no-unused-vars: 0 */
/**
 * The main server that wrap in the stream
 */
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const express = require('express');
const httpProxy = require('http-proxy-middleware');
// Shorthands
const join = path.join;
const isarray = Array.isArray;
// Properties
const defaultOptions = require('./lib/options');
const defaultProperties = ['directoryListing', 'livereload', 'debugger', 'mock'];
// Modules
const logutil = require('./lib/log');
// @TODO add them back later
// Const mockServer = require('./lib/mock-server');
// const debuggerClient = require('./lib/debugger-middleware');
const scriptsInjector = require('./lib/injector');
const enableMiddlewareShorthand = require('./lib/enable-middleware-shorthand');
/**
 * Export
 * @param {object} options
 * @return {object} app and config for destructing
 */
module.exports = function(options = {}) {
  // Config the config options
  let config = enableMiddlewareShorthand(defaultOptions, options, defaultProperties);
  // Init the app
  const app = express();
  // Properties
  let middlewares = [];
  let addDebugger = false;
  let proxies = config.proxies;
  // Make sure the namespace is correct first
  if (config.debugger.enable) {
    const namespace = config.debugger.namespace;
    if (!namespace) {
      config.debugger.namespace = '/debugger-io';
    } else if (namespace.substr(0, 1) !== '/') {
      config.debugger.namespace = '/' + namespace;
    }
    addDebugger = config.debugger.client !== false;
  }

  // Live reload and inject debugger
  if (config.reload.enable || addDebugger) {
    middlewares.push(
      scriptsInjector(
        {
          reload: config.reload.enable,
          debugger: addDebugger
        },
        config
      )
    );
  }
  // Init the debugger
  /*
  if (addDebugger) {
    middlewares.push(debuggerClient(config.debugger));
  }
  */
  // Extra middlewares pass directly from config
  if (typeof config.middleware === 'function') {
    middlewares.push(config.middleware);
  } else if (isarray(config.middleware)) {
    middlewares = middlewares.concat(config.middleware);
  }

  // Now inject the middlewares
  if (middlewares.length) {
    middlewares.filter(m => typeof m === 'function').forEach(m => app.use(m));
  }

  // First need to setup the mock (NEW)
  /*
  if (config.mock) {
    // Here we overwrite the proxies so the proxy get to the mock server
    proxies = mockServer(config.mock);
  }
  */
  // Proxy requests
  proxies.forEach(proxyoptions => {
    if (!proxyoptions.target) {
      logutil(chalk.red('Missing target property for proxy setting!'));
      return; // ignore!
    }
    let source = proxyoptions.source;
    delete proxyoptions.source;
    app.use(source, httpProxy(proxyoptions));
  });

  // This is the end - we continue in the next level up
  return { app, config };
};
