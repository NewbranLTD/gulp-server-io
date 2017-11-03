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
module.exports = function(options) {
  let proxies = [];
  const start = 'http://';
  const opt = options.mock;
  const port = opt.port || 3838;
  const host = opt.host || 'localhost';
  // @TODO check if the host has the http to start?
  // @TODO add https options
  if (args.debug) {
    logutil('mock option', opt);
  }
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
  // Return
  return { server, proxies };
};
