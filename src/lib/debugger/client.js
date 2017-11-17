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
// @20171117 integration with stacktrace

// Note the config is only the debugger part
module.exports = function(config) {
  // Now we need to supply a configurated option to not just point to our own local test machine
  // const debuggerHost = config.server.host || config.host;
  // const debuggerPort = config.server.port || config.port;
  const stacktraceName = 'stacktrace.js';
  const stacktraceSrc = join(
    __dirname,
    '..',
    '..',
    '..',
    'node_modules',
    'stacktrace-js',
    'dist',
    'stacktrace-with-promises-and-json-polyfills.js'
  );
  const debuggerPath = config.namespace;
  const debuggerJs = [debuggerPath, config.js].join('/');
  const stacktraceJsFile = [debuggerPath, stacktraceName].join('/');
  const eventName = config.eventName;
  // Just notify the console
  logutil(chalk.white('[debugger] ') + chalk.yellow('client is running'));
  // Export middleware
  return function(req, res, next) {
    switch (req.url) {
      case debuggerJs:
        fs.readFile(join(__dirname, 'client.tpl'), (err, data) => {
          if (err) {
            res.writeHead(500);
            const msg = 'Error reading io-debugger-client file';
            logutil(chalk.red(msg), chalk.yellow(err));
            return res.end(msg);
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
          if (typeof config.server === 'object') {
            if (
              config.server.clientConnectionOptions &&
              typeof config.server.clientConnectionOptions === 'object'
            ) {
              connectionOptions =
                ', ' + JSON.stringify(config.server.clientConnectionOptions);
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
          // The question is where do we cache it though ...
          res.writeHead(200);
          res.set('Content-Type', 'application/javascript');
          res.end(serveData);
        });
        break;
      case stacktraceJsFile:
        fs.readFile(stacktraceSrc, { encoding: 'utf8' }, (err, data) => {
          if (err) {
            res.writeHead(500);
            const msg = 'Error reading stacktrace source file!';
            logutil(chalk.red(msg), chalk.yellow(err));
            return res.end(msg);
          }
          res.writeHead(200);
          res.set('Content-Type', 'application/javascript');
          res.end(`${data}`);
        });
        break;
      default:
        next();
    }
  };
};
