/**
 * Mocking API call using json-server
 */
const _ = require('lodash');
const args = require('yargs');
const fs = require('fs-extra');
const chalk = require('chalk');
const jsonServer = require('json-server');
const logutil = require('./log.js');
// Expect to return this server config for the proxies
module.export = function(options) {
  let proxies = [];
  const opt = options.mock;
  const port = opt.port || 3000;
  if (args.debug) {
    logutil('mock option', opt);
  }
  const json = fs.readJSON(opt.json);
  _.forEach(json, (payload, name) => {
    const url = name.subtr(0, 1) === '/' ? name.substr(1, name.length) : name;
    proxies.push({
      source: '/' + url,
      target: ['http://localhost', port].join(':')
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
  // If for some reason why only want the server object
  if (opt.serverOnly) {
    return { _server, proxies };
  }
  // This is the real server that we need to call exit
  const server = _server.listen(port, () => {
    if (args.debug) {
      logutil(chalk.white('Mock json Server is running @ ', port));
    }
  });
  return { server, proxies };
};
