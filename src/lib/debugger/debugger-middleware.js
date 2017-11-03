'use strict';
/**
 * Middleware to serve up the client file
 */
const fs = require('fs');
const _ = require('lodash');
const chalk = require('chalk');
const { join } = require('path');
// Const gutil = require('gulp-util');
const logutil = require('../utils/log');
// Note the config pass here now is not the full original object, just the config.debugger part
module.exports = function(config) {
  // Now we need to supply a configurated option to not just point to our own local test machine
  // const debuggerHost = config.server.host || config.host;
  // const debuggerPort = config.server.port || config.port;
  const debuggerPath = config.namespace;
  const debuggerJs = [debuggerPath, config.js].join('/');
  const eventName = config.eventName;

  logutil(chalk.white('[debugger] ') + chalk.yellow('client is running'));
  // Export middleware
  return function(req, res, next) {
    if (req.url === debuggerJs) {
      fs.readFile(join(__dirname, 'client.tpl'), function(err, data) {
        if (err) {
          res.writeHead(500);
          logutil(chalk.red('Error reading io-debugger-client file'), chalk.yellow(err));
          return res.end('Just died!');
        }
        // If they want to ping the server back on init
        const ping =
          typeof config.client === 'object' && config.client.ping ? 'true' : 'false';
        // There is a problem when the server is running from localhost
        // and serving out to the proxy and the two ip address are not related to each other
        // and for most of the cases, the client is always pointing back to itself anyway
        let serveDataFn = _.template(data.toString());
        // Force websocket connection
        // see: http://stackoverflow.com/questions/8970880/cross-domain-connection-in-socket-io
        // @2017-06-29 forcing the connection to socket only because it just serving up local!
        let connectionOptions =
          ", {'force new connection': false , 'transports': ['websocket']}";
        if (typeof config.debugger.server === 'object') {
          if (
            config.debugger.server.clientConnectionOptions &&
            typeof config.debugger.server.clientConnectionOptions === 'object'
          ) {
            connectionOptions =
              ', ' + JSON.stringify(config.debugger.server.clientConnectionOptions);
          }
        }
        // Using the template method instead
        const serveData = serveDataFn({
          debuggerPath,
          eventName,
          ping,
          connectionOptions
        });
        // @TODO we should cache this file, otherwise every reload will have to generate it again
        res.writeHead(200);
        res.end(serveData);
      });
    } else {
      next();
    }
  };
};
