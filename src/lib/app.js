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
const defaultOptions = require('./options');
const defaultProperties = ['directoryListing', 'livereload', 'debugger', 'mock'];
// Modules
const logutil = require('./log');
// @TODO add them back later
const mockServer = require('./mock-server');
// Const debuggerClient = require('./lib/debugger-middleware');
const scriptsInjector = require('./injector');
const enableMiddlewareShorthand = require('./enable-middleware-shorthand');
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
  const closeFn = { close: () => {} };
  let mockServerInstance = closeFn;
  let debuggerInstance = closeFn;
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
  if (config.mock !== false) {
    // Here we overwrite the proxies so the proxy get to the mock server
    // @TODO sort out particular url that shouldn't be mock?
    const _mock = mockServer(config);
    mockServerInstance = _mock.server;
    proxies = _mock.proxies;
  }
  // Proxy requests
  proxies.forEach(proxyoptions => {
    if (!proxyoptions.target || !proxyoptions.source) {
      logutil(chalk.red('Missing target or source property for proxy setting!'));
      return; // ignore!
    }
    let source = proxyoptions.source;
    delete proxyoptions.source;
    app.use(source, httpProxy(proxyoptions));
  });
  // This is the end - we continue in the next level to construct the server
  return { app, config, mockServerInstance };
};
