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
 * @param {object} config - the full configuration object
 * @param {object} server http/https server instance
 * @param {function} logger
 * @return {object} socket the namespace instance and a close method
 */
module.exports = function(config, server, logger) {
  // Logger = logger || logutil; should not provide anything here!
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
  // Ditch the npm:table
  const table = rows => {
    if (Array.isArray(rows)) {
      rows.forEach(row => logutil(row));
    } else {
      logutil(rows);
    }
  };
  const parseObj = data => {
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  };

  // Encap to one func
  const displayError = e => {
    // This is required so we just do a simple test here
    // logutil('check typeof ' + data.toString());
    const color = getColor(e);
    let rows = [];
    if (e.from && e.color) {
      rows.push(chalk.yellow(`FROM: ${e.from}`));
    }
    keys.forEach(function(key) {
      if (e[key]) {
        rows.push([chalk.yellow(key + ':'), chalk.cyan(e[key])].join(' '));
      }
    });
    const _msg = parseObj(e.msg);
    if (typeof _msg === 'string') {
      rows.push([chalk.yellow('MESSAGE:'), chalk[color](e.msg)].join(' '));
    } else {
      // This is to accomdate the integration with other logging system sending back different messages
      rows.push(
        [chalk.yellow('MESSAGES:'), chalk[color](util.inspect(_msg, false, 2))].join(' ')
      );
    }
    table(rows);
  };
  // Run
  const namespace = io.of(config.debugger.namespace);
  // Start
  namespace.on('connection', function(socket) {
    // Announce to the client that is working
    socket.emit('hello', config.debugger.hello);
    // Listen
    socket.on(config.debugger.eventName, function(data) {
      // Provide a logger
      if (logger && typeof logger === 'function') {
        logger(data); // @TODO what to do with the logger
      }
      // Console log output
      const time = new Date().toString();
      // Output to console
      logutil(chalk.yellow('io debugger msg @ ' + time));
      let error = parseObj(data);
      if (typeof error === 'string') {
        table([chalk.yellow('STRING TYPE ERROR'), chalk.red(error)]);
      } else if (typeof error === 'object') {
        if (Array.isArray(error)) {
          error.forEach(e => displayError(e));
        } else {
          displayError(error);
        }
      } else {
        // Dump the content out
        table([
          chalk.cyan('UNKNOWN ERROR TYPE'),
          chalk.red(util.inspect(data, false, 2))
        ]);
      }
    });
  }); // End configurable name space

  // finally we return the io object just the name space instance
  return {
    socket: namespace,
    close: () => {
      const connectedNameSpaceSockets = Object.keys(namespace.connected); // Get Object with Connected SocketIds as properties
      connectedNameSpaceSockets.forEach(socketId => {
        namespace.connected[socketId].disconnect(); // Disconnect Each socket
      });
      namespace.removeAllListeners(); // Remove all Listeners for the event emitter
      delete io.nsps[namespace];
      // Now close the server?
      namespace.server.close();
    }
  };
};

// EOF
