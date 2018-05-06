/**
 * Mocking API call using json-server
 */
const _ = require('lodash');
const args = require('yargs');
const fs = require('fs-extra');
const chalk = require('chalk');
const jsonServer = require('json-server');
const logutil = require('./log');
const watcherFn = require('../app-watcher');
// Expect to return this server config for the proxies
module.exports = function(options) {
  let proxies = [];
  let unwatchFn = () => {};
  const start = 'http://';
  const opt = options.mock;
  const port = opt.port || 3838;
  const host = opt.host || 'localhost';
  // @TODO check if the host has the http to start?
  // @TODO add https options
  if (args.debug) {
    logutil('mock option', opt);
  }
  // @TODO should allow to pass multiple json files
  const json = fs.readJsonSync(opt.json);
  _.forEach(json, (payload, name) => {
    const url = name.substring(0, 1) === '/' ? name.substring(1, name.length) : name;
    proxies.push({
      source: '/' + url,
      target: start + [host.replace(start, ''), port].join(':')
    });
  });
  // @TODO later we need to take look at the proxies and,
  // See what should or should not get overwrite
  const _server = jsonServer.create();
  const _middlewares = jsonServer.defaults();
  const _router = jsonServer.router(opt.json);
  // Try to read the json file
  _server.use(_middlewares);
  _server.use(_router);
  // Apply more custom middlewares from config
  if (opt.middlewares && Array.isArray(opt.middlewares) && opt.middlewares.length > 0) {
    opt.middlewares.map(middleware => _server.use(middleware));
  }
  // This is the real server that we need to call exit
  const server = _server.listen(port, () => {
    if (args.debug) {
      logutil(chalk.white('Mock json Server is running @ ', port));
    }
  });
  // Restart method
  // if pass kill then just end the instance, this will replace the mockServerInstance
  const restart = kill => {
    if (kill) {
      logutil('Kill the mock server');
      return;
    }
    logutil(chalk.white('Mock josn server restart'));
  };
  // Start the watcher here
  if (opt.watch !== false) {
    unwatchFn = watcherFn([opt.json], restart, {
      interval: opt.interval
    });
  }
  // 05032018 - also return a restart method, so whenever the file change
  // it will restart by itself
  // Return
  return { server, proxies, restart, unwatchFn };
};
