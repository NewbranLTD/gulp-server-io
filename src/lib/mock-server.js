/**
 * Mocking API call using json-server
 */
const chalk = require('chalk');
const jsonServer = require('json-server');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const logutil = require('./log.js');
// Expect to return this server config for the proxies
module.export = function(opt) {
  const router = jsonServer.router(opt.json);
  server.use(middlewares);
  server.use(router);
  // Apply more custom middlewares from config
  if (opt.middlewares && Array.isArray(opt.middlewares) && opt.middlewares.length > 0) {
    opt.middlewares.map(middleware => server.use(middleware));
  }
  // If for some reason why only want the server object
  if (opt.serverOnly) {
    return server;
  }
  server.listen(opt.port, () => {
    logutil(chalk.white('[JSON Server is running]', opt.port));
  });
};
