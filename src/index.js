/* eslint no-unused-vars: 0 */
/**
 * The main server that wrap in the stream
 */
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const connect = require('connect');
const serveIndex = require('serve-index');
const httpProxy = require('http-proxy-middleware');
// Shorthands
const join = path.join;
const isarray = Array.isArray;
// Properties
const defaultOptions = require('./options');
const defaultProperties = ['directoryListing', 'livereload', 'debugger', 'mock'];
// Modules
const logutil = require('./lib/log');
const mockServer = require('./lib/mock-server');
const debuggerClient = require('./lib/debugger-middleware');
const connectLivereload = require('./lib/connect-livereload');
const enableMiddlewareShorthand = require('./lib/enable-middleware-shorthand');
/**
 * Export
 * @param {object} options
 * @return {object} app and config for destructing
 */
module.exports = function(options = {}) {
  let config = enableMiddlewareShorthand(defaultOptions, options, defaultProperties);
  // Init the app
  const app = connect();
  // Properties
  let lrServer = null;
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
    addDebugger = config.ioDebugger.client !== false;
  }
  // Config open
  if (
    typeof config.open === 'string' &&
    config.open.length > 0 &&
    config.open.indexOf('http') !== 0
  ) {
    // Ensure leading slash if this is NOT a complete url form
    config.open = [config.open.substr(0, 1) === '/' ? '' : '/', config.open].join('');
  }
  // Live reload and inject debugger
  if (config.livereload.enable) {
    app.use(
      connectLivereload({
        liveReload: true,
        port: config.livereload.port,
        debugger: addDebugger
      })
    );
  } else {
    // This should not happen but ...
    app.use(
      connectLivereload({
        liveReload: false,
        debugger: addDebugger
      })
    );
  }
  // Init the debugger
  if (addDebugger) {
    app.use(debuggerClient(config.debugger));
  }
  // Extra middlewares pass directly from config
  if (typeof config.middleware === 'function') {
    app.use(config.middleware);
  } else if (isarray(config.middleware)) {
    config.middleware.filter(m => typeof m === 'function').forEach(m => app.use(m));
  }
  // First need to setup the mock (NEW)
  if (config.mock) {
    // Here we overwrite the proxies so the proxy get to the mock server
    proxies = mockServer(config.mock);
  }
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
  // Directory listing
  if (config.directoryListing.enable) {
    app.use(
      config.path,
      serveIndex(
        path.resolve(config.directoryListing.path),
        config.directoryListing.options
      )
    );
  }
  // This is the end - we continue in the next level up
  return { app, config };
};
