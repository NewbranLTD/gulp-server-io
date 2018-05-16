'use strict';
/**
 * The socket.io server and reporting
 */
// const _ = require('lodash');
const util = require('util');
const chalk = require('chalk');
const logutil = require('../utils/log');
const { table, parseObj, displayError } = require('./helpers');
/**
 * DebuggerServer
 * @param {object} config - the full configuration object
 * @param {object} io socket server instance
 * @param {function} logger util for logging
 * @return {object} socket the namespace instance and a close method
 */
module.exports = function(config, io, logger) {
  // Show if this is running
  logutil(
    chalk.white('[debugger] ') +
      chalk.yellow('server is running') +
      ' ' +
      chalk.white(config.version)
  );
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
        // Will always be a object anyway
        displayError(error);
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
