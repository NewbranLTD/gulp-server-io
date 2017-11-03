'use strict';
/**
 * The socket.io server and reporting
 */
const util = require('util');
const chalk = require('chalk');
const socketIO = require('socket.io');
const logutil = require('../utils/log');
/**
 * Just getting some color configuration
 */
const getColor = function(data) {
  let dc = 'cyan';
  let str = data.color ? data.color : data.from ? data.from : dc;
  if (str === dc) {
    return str; // Default
  }
  switch (str) {
    case 'debug':
      return 'red';
    case 'info':
      return 'magenta';
    case 'warning':
      return 'yellow';
    default:
      if (chalk[str]) {
        return str;
      }
      return dc;
  }
};
/**
 * DebuggerServer
 * @param {object} config
 * @param {object} server http/https server instance
 * @param {function} logger
 * @return {object} socket the namespace instance and a close method
 */
module.exports = function(config, server, logger) {
  logger = logger || logutil;
  let socketConfig = null;
  // Force the socket.io server to use websocket protocol only
  if (typeof config.debugger.server === 'object') {
    if (config.debugger.server.socketOnly) {
      socketConfig =
        config.debugger.server.transportConfig &&
        Array.isArray(config.debugger.server.transportConfig)
          ? config.debugger.server.transportConfig
          : ['websocket'];
    }
  }
  const io = socketIO(server, socketConfig);
  const keys = ['browser', 'location'];
  // Show if this is running
  logutil(
    chalk.white('[debugger] ') +
      chalk.yellow('server is running') +
      ' ' +
      chalk.white(config.version)
  );
  if (config.debugger.debugSocket) {
    logutil(chalk.white('[debugger] socket server:'), server, socketConfig);
  }
  // Run
  const namespace = io.of(config.debugger.namespace);
  // Start
  namespace.on('connection', function(socket) {
    // Announce to the client that is working
    socket.emit('hello', 'IO DEBUGGER is listening ...');
    // Listen
    socket.on(config.debugger.eventName, function(data) {
      // Provide a logger
      if (logger && typeof logger === 'function') {
        logger(data);
        if (config.debugger.log !== 'BOTH') {
          return;
        }
      }
      // Console log output
      const time = new Date().toString();
      // Output to console
      logutil(chalk.yellow('io debugger msg @ ' + time));
      if (typeof data === 'string') {
        logutil(chalk.yellow(data));
      } else if (data.toString() === '[object Object]') {
        // This is required so we just do a simple test here
        // logutil('check typeof ' + data.toString());
        var color = getColor(data);
        if (data.from && data.color) {
          logutil('from: ', data.from);
        }
        keys.forEach(function(key) {
          if (data[key]) {
            logutil(chalk.yellow(key + ':') + chalk.cyan(data[key]));
          }
        });
        if (typeof data.msg === 'string') {
          logutil(chalk.yellow('message:') + chalk[color](data.msg));
        } else {
          // This is to accomdate the integration with other logging system sending back different messages
          logutil(chalk.yellow('message:'));
          logutil(chalk[color](util.inspect(data.msg, false, 2)));
        }
      } else {
        // Unknown
        // dump the content out
        logutil(chalk.cyan('UNKNOWN ERROR TYPE'));
        logutil(chalk.red(util.inspect(data, false, 2)));
      }
    });
  }); // End configurable name space
  // finally we return the io object just the name space instance
  return {
    socket: namespace,
    close: () => {
      namespace.socket.close();
    }
  };
};

// EOF
