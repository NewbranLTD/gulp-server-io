/* eslint no-unused-vars: 0 */
/**
 * The main server that wrap in the stream
 */
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const helmet = require('helmet');
const express = require('express');
const bodyParser = require('body-parser');
const httpProxy = require('http-proxy-middleware');
// Shorthands
const join = path.join;
const isarray = Array.isArray;
// Properties
const defaultOptions = require('./options');
const defaultProperties = ['reload', 'debugger', 'mock'];
const enableMiddlewareShorthand = require('./options/enable-middleware-shorthand');
// Modules
const logutil = require('./utils/log');
const scriptsInjector = require('./injector');
const mockServer = require('./utils/mock-server');
const debuggerClient = require('./debugger/client');
/**
 * Export
 * @param {object} options
 * @return {object} app and config for destructing
 */
module.exports = function(options = {}) {
  // Config the config options
  let config = enableMiddlewareShorthand(defaultOptions, options, defaultProperties);

  console.log('config', config);

  // Init the app
  const app = express();
  let addDebugger = false;
  // @BUG here if we try to move the object into array
  // somehow it disappear later (2017-12-14)
  let proxies = config.proxies;
  // Default callbacks
  const closeFn = { close: () => {} };
  let mockServerInstance = closeFn;
  let debuggerInstance = closeFn;
  // Properties
  let middlewares = proxies.length
    ? []
    : [bodyParser.urlencoded({ extended: true }), bodyParser.json()];
  if (config.development) {
    middlewares.push(helmet.noCache());
  }
  // Make sure the namespace is correct first
  if (config.debugger.enable && config.development) {
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
  if (addDebugger) {
    middlewares.push(debuggerClient(config.debugger));
  }
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
  if (config.mock.enable && config.mock.json && config.development) {
    // Here we overwrite the proxies so the proxy get to the mock server
    // @TODO sort out particular url that shouldn't be mock?
    const _mock = mockServer(config);
    mockServerInstance = _mock.server;
    // Overwrite the proxies
    proxies = _mock.proxies;
  }
  // Proxy requests
  // @BUG this is not working in server mode
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
