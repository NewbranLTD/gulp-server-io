/**
 * This will be come the main export file
 * When the consumer call it
 * const gulpServerIo = require('gulp-server-io')
 * When they want to use the underlying connect server
 * const server = require('gulp-server-io/server');
 * neat!
 */
const fs = require('fs');
const chalk = require('chalk');
const express = require('express');
const through = require('through2');
// Modules
const server = require('./src');
const logutil = require('./src/lib/log');
const watcher = require('./src/lib/watcher');
const debuggerServer = require('./src/lib/debugger-server');
// Final export for gulp
module.export = function(options = {}) {
  const { app, config } = server(options);
  // Store the files for ?
  let files = [];
  let unwatchFn;
  // Create static server wrap in a stream
  const stream = through
    .obj((file, enc, callback) => {
      app.use(express.static(config.path));
      if (config.reload.enable) {
        // Run the watcher
        unwatchFn = watcher(config.path, app, { verbose: config.reload.verbose });
      }
      files.push(file);
      callback();
    })
    .on('data', f => {
      files.push(f);
    })
    .on('end', () => {
      if (config.fallback) {
        files.forEach(file => {
          const fallbackFile = file.path + '/' + config.fallback;
          if (fs.existsSync(fallbackFile)) {
            app.use((req, res) => {
              res.setHeader('Content-Type', 'text/html; charset=UTF-8');
              fs.createReadStream(fallbackFile).pipe(res);
            });
          }
        });
      }
    });
  // Start another part
  let webserver = null;
  // Init our socket.io server
  let socket = null;
  if (config.debugger.enable && config.debugger.server !== false) {
    // Passing the raw io object back
    socket = debuggerServer(config.debugger, webserver);
  }
  logutil(
    chalk.white('Webserver started at'),
    chalk.cyan(
      'http' + (config.https ? 's' : '') + '://' + config.host + ':' + config.port
    )
  );
  // When ctrl-c or stream.emit('kill')
  stream.on('kill', () => {
    webserver.close();
    unwatchFn();
    // Need to add kill watcher
    if (socket && socket.server) {
      socket.server.close();
    }
  });
  return stream;
};
